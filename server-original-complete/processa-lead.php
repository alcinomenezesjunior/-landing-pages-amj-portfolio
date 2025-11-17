<?php
// Define o tipo de conteúdo como JSON para a resposta
header('Content-Type: application/json');

// 1. Recebe os dados JSON enviados pelo JavaScript
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Verifica se os dados foram recebidos corretamente
if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'Nenhum dado recebido.']);
    exit;
}

// 2. Captura o endereço de IP do visitante (usando os cabeçalhos da Hostinger)
$ip_address = 'IP não encontrado';
if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
    $ip_address = $_SERVER['HTTP_X_REAL_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
} elseif (!empty($_SERVER['REMOTE_ADDR'])) {
    $ip_address = $_SERVER['REMOTE_ADDR'];
}

// 3. Adiciona o endereço de IP ao array de dados
$data['ipAddress'] = $ip_address;

// 4. Envia os dados completos para o Webhook do Make.com
$make_webhook_url = 'https://hook.eu1.make.com/7he7b47l9xah1l4v7j579yxgmyxkc6ht'; // O seu URL do Make

// Usa cURL para fazer o pedido POST
$ch = curl_init($make_webhook_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 5. Devolve uma resposta de sucesso para o navegador
if ($http_code >= 200 && $http_code < 300) {
    echo json_encode(['status' => 'success', 'message' => 'Dados enviados para o webhook.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Falha ao enviar para o webhook.', 'http_code' => $http_code]);
}
?>