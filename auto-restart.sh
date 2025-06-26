#!/bin/bash

# Auto-restart script for handling 500 errors after idle periods
# This script monitors the application and restarts services if needed

LOG_FILE="/var/log/auto-restart.log"
MAX_RETRIES=3
CHECK_INTERVAL=300  # 5 minutes

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

check_application_health() {
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80 --max-time 10)
    echo "$response"
}

check_database_connection() {
    docker exec campus-job-portal-db mysql -u laravel_user -plaravel_password -e "SELECT 1;" >/dev/null 2>&1
    return $?
}

restart_services() {
    log_message "Starting service restart procedure..."
    
    # Restart PHP-FPM container
    log_message "Restarting PHP-FPM container..."
    docker restart campus-job-portal-app
    sleep 10
    
    # Restart Nginx container
    log_message "Restarting Nginx container..."
    docker restart campus-job-portal-webserver
    sleep 10
    
    # Clear Laravel caches
    log_message "Clearing Laravel caches..."
    docker exec campus-job-portal-app php artisan cache:clear
    docker exec campus-job-portal-app php artisan config:clear
    docker exec campus-job-portal-app php artisan route:clear
    docker exec campus-job-portal-app php artisan view:clear
    
    log_message "Service restart completed"
}

monitor_loop() {
    local consecutive_failures=0
    
    while true; do
        log_message "Checking application health..."
        
        # Check HTTP response
        local http_status=$(check_application_health)
        
        # Check database connection
        if ! check_database_connection; then
            log_message "Database connection failed"
            consecutive_failures=$((consecutive_failures + 1))
        elif [ "$http_status" != "200" ]; then
            log_message "HTTP health check failed with status: $http_status"
            consecutive_failures=$((consecutive_failures + 1))
        else
            log_message "Health check passed (HTTP: $http_status)"
            consecutive_failures=0
        fi
        
        # Restart if we have consecutive failures
        if [ $consecutive_failures -ge 2 ]; then
            log_message "Detected $consecutive_failures consecutive failures, initiating restart..."
            restart_services
            consecutive_failures=0
            
            # Wait a bit longer after restart
            sleep 60
        fi
        
        sleep $CHECK_INTERVAL
    done
}

# Main execution
log_message "Auto-restart monitor started"
log_message "Check interval: ${CHECK_INTERVAL}s, Max retries: $MAX_RETRIES"

# Make sure we can access Docker
if ! docker ps >/dev/null 2>&1; then
    log_message "ERROR: Cannot access Docker. Make sure Docker is running and user has permissions."
    exit 1
fi

# Start monitoring
monitor_loop