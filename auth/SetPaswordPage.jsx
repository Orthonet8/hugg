import React, { useState } from "react";
import Layout from "../../components/LayOut";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setError("");
    alert("Password set successfully!");
  };

  return (
    <Layout>
      <Card className="mx-auto w-full max-w-lg p-6 sm:p-8">
        <h2 className="text-3xl font-semibold text-primary mb-3 text-center">የይለፍ ቃል አዘጋጅ</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          መለያዎን ለመጠበቅ አዲስ የይለፍ ቃል ያስገቡ።
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="password"
            label="የይለፍ ቃል"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
          <Input
            id="confirmPassword"
            label="የይለፍ ቃል ያረጋግጡ"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full">አዲስ የይለፍ ቃል አስቀምጥ</Button>
        </form>
      </Card>
    </Layout>
  );
}
