const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate SHA-256 hash of certificate file
const generateCertificateHash = (fileData) => {
    try {
        if (typeof fileData === 'string') {
            // If it's a file path
            const data = fs.readFileSync(fileData);
            return crypto.createHash('sha256').update(data).digest('hex');
        } else {
            // If it's buffer/data
            return crypto.createHash('sha256').update(fileData).digest('hex');
        }
    } catch (error) {
        throw new Error(`Failed to generate certificate hash: ${error.message}`);
    }
};

// Generate or retrieve RSA key pair for signing
const getKeyPair = () => {
    const privateKeyPath = path.join(__dirname, '../keys/private_key.pem');
    const publicKeyPath = path.join(__dirname, '../keys/public_key.pem');
    
    // Ensure keys directory exists
    const keysDir = path.dirname(privateKeyPath);
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }
    
    // Check if keys already exist
    if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
        const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
        return { privateKey, publicKey };
    }
    
    // Generate new keys if they don't exist
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    
    // Save keys for future use
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
    
    return { privateKey, publicKey };
};

// Create digital signature for certificate
const createDigitalSignature = (certificateHash, approverDetails) => {
    try {
        const { privateKey } = getKeyPair();
        
        // Create signature data
        const signatureData = `${certificateHash}:${approverDetails.approvedBy}:${approverDetails.approverRole}:${new Date().toISOString()}`;
        
        // Sign the data
        const sign = crypto.createSign('sha256');
        sign.update(signatureData);
        const signature = sign.sign(privateKey, 'hex');
        
        return {
            signature,
            signatureData,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        throw new Error(`Failed to create digital signature: ${error.message}`);
    }
};

// Verify digital signature
const verifyDigitalSignature = (certificateHash, signature, signatureData) => {
    try {
        const { publicKey } = getKeyPair();
        
        const verify = crypto.createVerify('sha256');
        verify.update(signatureData);
        const isValid = verify.verify(publicKey, signature, 'hex');
        
        return isValid;
    } catch (error) {
        throw new Error(`Failed to verify digital signature: ${error.message}`);
    }
};

// Create certificate metadata object
const createCertificateMetadata = (certificateHash, approverDetails) => {
    const signatureObj = createDigitalSignature(certificateHash, approverDetails);
    
    return {
        hash: certificateHash,
        signature: signatureObj.signature,
        signatureData: signatureObj.signatureData,
        approvedBy: approverDetails.approvedBy,
        approverRole: approverDetails.approverRole,
        timestamp: signatureObj.timestamp,
        isVerified: false // Will be verified on demand
    };
};

// Verify certificate integrity
const verifyCertificateIntegrity = (certificateData) => {
    try {
        const isSignatureValid = verifyDigitalSignature(
            certificateData.hash,
            certificateData.signature,
            certificateData.signatureData
        );
        
        return {
            isValid: isSignatureValid,
            hash: certificateData.hash,
            approvedBy: certificateData.approvedBy,
            approverRole: certificateData.approverRole,
            timestamp: certificateData.timestamp
        };
    } catch (error) {
        return {
            isValid: false,
            error: error.message
        };
    }
};

module.exports = {
    generateCertificateHash,
    getKeyPair,
    createDigitalSignature,
    verifyDigitalSignature,
    createCertificateMetadata,
    verifyCertificateIntegrity
};
