import React from 'react';

function LoginPage() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:3001/login'; // Triggers backend flow
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to Skill Bridge</h1>
        <p className="text-gray-600 mb-8">
          Connect to your account and discover job matches based on your qualifications.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Login with Cognito
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
