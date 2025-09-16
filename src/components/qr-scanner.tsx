'use client'
import ReactQrScanner from 'react-qr-scanner';

interface QrScannerProps {
    onResult: (result: any) => void;
    onError: (error: any) => void;
}

export const QrScanner = ({ onResult, onError }: QrScannerProps) => {
    
    const handleScan = (data: any) => {
        if (data && data.text) {
            onResult(data);
        }
    }

    const previewStyle = {
        height: 240,
        width: 320,
    }

    return (
        <ReactQrScanner
            delay={300}
            onError={onError}
            onScan={handleScan}
            style={{ width: '100%' }}
        />
    )
}
