pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    environment {
        EC2_IP = "51.21.128.240"
        MONGO_URI = credentials('mongo-uri')
    }

    stages {

        // =========================
        // 1️⃣ Install Frontend Dependencies
        // =========================
        stage('Install Frontend Dependencies') {
            steps {
                bat 'cd frontend && npm install'
            }
        }

        // =========================
        // 2️⃣ Build Frontend
        // =========================
        stage('Build Frontend') {
            steps {
                bat 'cd frontend && npm run build'
            }
        }

        // =========================
        // 3️⃣ Copy frontend build to backend
        // =========================
        stage('Copy Frontend to Backend') {
            steps {
                bat 'xcopy /E /I /Y frontend\\build backend\\public'
            }
        }

        // =========================
        // 4️⃣ Install Backend Dependencies
        // =========================
        stage('Install Backend Dependencies') {
            steps {
                bat 'cd backend && npm install'
            }
        }

        // =========================
        // 5️⃣ Run Backend Tests
        // =========================
        stage('Run Tests') {
            steps {
                bat 'cd backend && npm test'
            }
        }

        // =========================
        // 6️⃣ Deploy to EC2
        // =========================
        stage('Deploy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'PEM')]) {
                    bat """
                    @echo off
                    :: Fix permissions for PEM
                    icacls.exe "%PEM%" /reset
                    icacls.exe "%PEM%" /inheritance:r
                    icacls.exe "%PEM%" /grant:r *S-1-5-18:R

                    :: SSH and deploy
                    "C:\\Windows\\System32\\OpenSSH\\ssh.exe" -i "%PEM%" -o StrictHostKeyChecking=no ubuntu@%EC2_IP% ^
                    "cd todo_application/backend && git pull origin main && npm install && pm2 restart all"
                    """
                }
            }
        }
    }
}
