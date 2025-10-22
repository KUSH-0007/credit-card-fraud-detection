# Credit Card Fraud Detection System

This project is a Credit Card Fraud Detection System that utilizes a combination of technologies including React.js for the frontend, Node.js and Express.js for the backend, Flask for the machine learning API, and MongoDB for data storage. The application is containerized using Docker and can be deployed on AWS.

## Project Structure

```
credit-card-fraud-detection-system
├── backend
│   ├── src
│   │   ├── config
│   │   │   └── db.js
│   │   ├── controllers
│   │   │   └── transactionController.js
│   │   ├── models
│   │   │   └── Transaction.js
│   │   ├── routes
│   │   │   └── transactionRoutes.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   ├── Dashboard.js
│   │   │   └── TransactionForm.js
│   │   ├── services
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── tailwind.config.js
├── ml-api
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Machine Learning**: Flask
- **Database**: MongoDB
- **Containerization**: Docker
- **Deployment**: AWS

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd credit-card-fraud-detection-system
   ```

2. **Backend Setup**:
   - Navigate to the `backend` directory:
     ```
     cd backend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Build the Docker image:
     ```
     docker build -t backend .
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` directory:
     ```
     cd ../frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```
   - Build the Docker image:
     ```
     docker build -t frontend .
     ```

4. **Machine Learning API Setup**:
   - Navigate to the `ml-api` directory:
     ```
     cd ../ml-api
     ```
   - Install dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Build the Docker image:
     ```
     docker build -t ml-api .
     ```

5. **Run the Application**:
   - Navigate back to the root directory:
     ```
     cd ..
     ```
   - Start all services using Docker Compose:
     ```
     docker-compose up
     ```

## Usage

- Access the frontend application at `http://localhost:3000`.
- The backend API will be available at `http://localhost:5000/api`.
- The machine learning API can be accessed at `http://localhost:5001/predict`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.