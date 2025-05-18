<?php

// This script updates all notification classes to use the correct toBroadcast format
// to ensure that they appear properly in toast notifications

$notificationsDir = __DIR__ . '/app/Notifications';
$files = glob($notificationsDir . '/*.php');

$updateCount = 0;
$skippedCount = 0;
$errorCount = 0;

$correctPattern = <<<'EOT'
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => get_class($this),
            'data' => $this->toDatabase($notifiable),
            'created_at' => now()->toISOString(),
            'read_at' => null,
        ]);
    }
EOT;

$correctPatternWithToArray = <<<'EOT'
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'type' => get_class($this),
            'data' => $this->toArray($notifiable),
            'created_at' => now()->toISOString(),
            'read_at' => null,
        ]);
    }
EOT;

echo "Updating notification classes to use the correct toBroadcast format...\n\n";

foreach ($files as $file) {
    $basename = basename($file);
    
    // Skip BaseNotification
    if ($basename === 'BaseNotification.php') {
        echo "Skipping {$basename} (base class)\n";
        $skippedCount++;
        continue;
    }
    
    try {
        $content = file_get_contents($file);
        
        // Skip if file doesn't have toBroadcast method
        if (!preg_match('/public\s+function\s+toBroadcast\s*\(\s*\$notifiable\s*\)/i', $content)) {
            echo "Skipping {$basename} (no toBroadcast method)\n";
            $skippedCount++;
            continue;
        }
        
        // Determine if the class uses toDatabase or toArray
        $usesToDatabase = strpos($content, 'toDatabase($notifiable)') !== false;
        
        // Create the replacement
        $pattern = '/public\s+function\s+toBroadcast\s*\(\s*\$notifiable\s*\).*?{.*?return\s+new\s+BroadcastMessage\s*\(.*?\);.*?}/s';
        
        if ($usesToDatabase) {
            $replacement = $correctPattern;
        } else {
            $replacement = $correctPatternWithToArray;
        }
        
        // Replace the method
        $newContent = preg_replace($pattern, $replacement, $content);
        
        // If changes were made
        if ($newContent !== $content) {
            file_put_contents($file, $newContent);
            echo "Updated {$basename}\n";
            $updateCount++;
        } else {
            echo "No changes needed for {$basename}\n";
            $skippedCount++;
        }
    } catch (Exception $e) {
        echo "Error processing {$basename}: {$e->getMessage()}\n";
        $errorCount++;
    }
}

echo "\nSummary:\n";
echo "- {$updateCount} notification classes updated\n";
echo "- {$skippedCount} notification classes skipped\n";
echo "- {$errorCount} errors encountered\n";
echo "\nComplete!\n";
