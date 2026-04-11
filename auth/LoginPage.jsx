import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/LayOut';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ emailOrMobile, password });
    navigate('/members');
  };

  return (
    <Layout>
      <Card className="mx-auto w-full max-w-lg p-6 sm:p-8">
        <h1 className="text-3xl font-semibold text-primary text-center mb-2">እንኳን ደህና መጡ</h1>
        <p className="text-sm text-slate-600 text-center mb-6">እባክዎ መለያዎን በመጠቀም ይግቡ።</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ኢሜይል ወይም ስልክ"
            type="text"
            placeholder="example@gmail.com"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            required
          />
          <Input
            label="የይለፍ ቃል"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <Link to="/set-password" className="text-sm font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full">ግባ</Button>
        </form>

        <div className="my-6 flex items-center justify-center gap-3 text-sm text-gray-400">
          <span className="h-px flex-1 bg-gray-200"></span>
          <span>or</span>
          <span className="h-px flex-1 bg-gray-200"></span>
        </div>

        <button
          type="button"
          className="w-full rounded-full border border-primary bg-white py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition flex items-center justify-center gap-2"
          onClick={() => alert('Google Login TODO')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.111C34.945 32.67 30.123 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.14 0 5.996 1.198 8.15 3.15l5.657-5.657C34.99 6.161 29.795 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20c11.046 0 20-8.954 20-20 0-1.341-.132-2.644-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.57 4.819C14.242 16.51 18.845 14 24 14c3.14 0 5.996 1.198 8.15 3.15l5.657-5.657C34.99 6.161 29.795 4 24 4 16.665 4 10.112 8.696 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.421 0 10.216-1.796 13.876-4.866l-6.43-5.328C29.99 34.91 27.201 36 24 36c-6.054 0-11.19-4.344-12.296-10.078l-6.44 4.96C8.193 39.61 15.625 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.111c-1.115 3.46-4.152 6-7.9 6-3.201 0-5.99-1.09-7.814-2.859l-6.432 5.326C15.95 38.728 19.819 40 24 40c9.389 0 17-7.611 17-17 0-1.34-.132-2.644-.389-3.917z"
            />
          </svg>
          Google በመጠቀም ቀጥል
        </button>

        <p className="text-center text-xs mt-3 text-gray-400">
          በመቀጠል ውሎቻችንን እና የግላዊነት ፖሊሲያችንን ይቀበላሉ።{' '}
          <Link to="/terms" className="text-primary underline">
            Terms of Service
          </Link>{' '}
          እና{' '}
          <Link to="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Card>
    </Layout>
  );
};

export default LoginPage;
