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
                checkout 
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKERscm_IMAGE_NAME}:${DOCKER_IMAGE_TAG}")
                }
            }
        }

        stage('Deploy Docker Container') {
            steps {
                script {
                    sh """
                    # 停止並移除任何已經運行的容器
                    docker stop ${DOCKER_IMAGE_NAME} || true
                    docker rm ${DOCKER_IMAGE_NAME} || true

                    # 運行新的 Docker 容器
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
