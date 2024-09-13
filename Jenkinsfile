pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'my-project'
        DOCKER_IMAGE_TAG = 'latest'
        PORT = '1234'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}")
                }
            }
        }

        stage('Deploy Docker Container') {
            steps {
                script {
                    sh """
                    docker stop ${DOCKER_IMAGE_NAME} || true
                    docker rm ${DOCKER_IMAGE_NAME} || true
                    docker run -d -p ${PORT}:${PORT} --name ${DOCKER_IMAGE_NAME} ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
