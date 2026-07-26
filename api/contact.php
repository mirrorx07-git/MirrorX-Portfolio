<?php
/*
 * MirrorX Portfolio - Contact Form Backend
 * This sends form messages directly to your email
 *
 * SETUP:
 * 1. Replace 'your-email@gmail.com' with your actual email
 * 2. Upload to a PHP-enabled hosting server
 * 3. Update the fetch URL in script.js to point to this file
 */

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input
if (
    empty($input['name']) ||
    empty($input['email']) ||
    empty($input['subject']) ||
    empty($input['message'])
) {
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required'
    ]);
    exit();
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars(strip_tags(trim($input['name'])));
$email = htmlspecialchars(strip_tags(trim($input['email'])));
$subject = htmlspecialchars(strip_tags(trim($input['subject'])));
$message = htmlspecialchars(strip_tags(trim($input['message'])));

// ============================================
// YOUR EMAIL ADDRESS - CHANGE THIS!
// ============================================
$to_email = 'mirrorxofficial.07@gmail.com';

// Email subject
$email_subject = "Portfolio Contact: " . $subject;

// Build HTML email body
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #0a0a0f; color: #e0e0e0; }
        .container { max-width: 600px; margin: 0 auto; padding: 30px; background: #12121a; border-radius: 12px; border: 1px solid #1e1e2e; }
        .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #00f0ff; margin-bottom: 20px; }
        .header h1 { color: #00f0ff; font-size: 24px; margin: 0; }
        .field { margin-bottom: 15px; }
        .field .label { color: #00f0ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
        .field .value { color: #e0e0e0; font-size: 16px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid #1e1e2e; }
        .message-box { background: rgba(0, 240, 255, 0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(0, 240, 255, 0.15); margin-top: 20px; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>&lt;MirrorX/&gt; Portfolio Message</h1>
        </div>
        <div class='field'>
            <div class='label'>From</div>
            <div class='value'>{$name}</div>
        </div>
        <div class='field'>
            <div class='label'>Email</div>
            <div class='value'>{$email}</div>
        </div>
        <div class='field'>
            <div class='label'>Subject</div>
            <div class='value'>{$subject}</div>
        </div>
        <div class='message-box'>
            <div class='label'>Message</div>
            <p style='line-height: 1.7;'>{$message}</p>
        </div>
        <div class='footer'>
            <p>Sent from MirrorX Portfolio Website</p>
            <p>Reply directly to: {$email}</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: MirrorX Portfolio <noreply@yourdomain.com>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_sent = mail($to_email, $email_subject, $email_body, $headers);

if ($mail_sent) {
    // Log the contact (optional)
    $log_entry = date('Y-m-d H:i:s') . " | {$name} | {$email} | {$subject}\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);

    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully! I\'ll get back to you soon.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message. Please try again or email directly.'
    ]);
}

// ============================================
// VISITOR COUNTER API ENDPOINT
// Add this if you want a self-hosted counter
// Access via: api/contact.php?action=visit
// ============================================
if (isset($_GET['action']) && $_GET['action'] === 'visit') {
    $counter_file = '../visitor-count.json';

    if (!file_exists($counter_file)) {
        file_put_contents($counter_file, json_encode(['count' => 0, 'unique' => []]));
    }

    $data = json_decode(file_get_contents($counter_file), true);
    $visitor_ip = $_SERVER['REMOTE_ADDR'];
    $today = date('Y-m-d');

    // Count unique daily visitors
    $visitor_key = md5($visitor_ip . $today);

    if (!in_array($visitor_key, $data['unique'] ?? [])) {
        $data['count']++;
        $data['unique'][] = $visitor_key;

        // Clean old entries (keep last 1000)
        if (count($data['unique']) > 1000) {
            $data['unique'] = array_slice($data['unique'], -500);
        }

        file_put_contents($counter_file, json_encode($data), LOCK_EX);
    }

    echo json_encode([
        'success' => true,
        'count' => $data['count']
    ]);
    exit();
}
?>