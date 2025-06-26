#!/bin/bash

# Health monitoring script for production deployment
# This script helps diagnose 500 errors and connection issues

echo "=== Campus Job Portal Health Monitor ==="
echo "Timestamp: $(date)"
echo ""

# Check Docker containers status
echo "1. Docker Containers Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check Nginx logs for errors
echo "2. Recent Nginx Errors (last 20 lines):"
docker logs campus-job-portal-webserver 2>&1 | tail -20
echo ""

# Check PHP-FPM logs
echo "3. Recent PHP-FPM Errors (last 20 lines):"
docker logs campus-job-portal-app 2>&1 | tail -20
echo ""

# Check MySQL connection
echo "4. Database Connection Test:"
docker exec campus-job-portal-db mysql -u laravel_user -plaravel_password -e "SELECT 1 as connection_test;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database connection: OK"
else
    echo "❌ Database connection: FAILED"
fi
echo ""

# Check application health endpoint
echo "5. Application Health Check:"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80)
if [ "$response" = "200" ]; then
    echo "✅ Application HTTP response: OK ($response)"
else
    echo "❌ Application HTTP response: FAILED ($response)"
fi
echo ""

# Check disk space
echo "6. Disk Space Usage:"
df -h | grep -E '(Filesystem|/dev/)'
echo ""

# Check memory usage
echo "7. Memory Usage:"
free -h
echo ""

# Check Laravel logs
echo "8. Recent Laravel Errors (last 10 lines):"
docker exec campus-job-portal-app tail -10 /var/www/storage/logs/laravel.log 2>/dev/null || echo "No Laravel logs found"
echo ""

# Check PHP errors
echo "9. Recent PHP Errors (last 10 lines):"
docker exec campus-job-portal-app tail -10 /var/log/php_errors.log 2>/dev/null || echo "No PHP error logs found"
echo ""

echo "=== Health Check Complete ==="
echo "If you see errors above, check the specific logs for more details."
echo "To run this script periodically: */5 * * * * /path/to/monitor-health.sh >> /var/log/health-monitor.log"