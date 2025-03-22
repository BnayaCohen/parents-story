
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Pass the name as username for compatibility with existing auth system
      await login(name, email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in" dir="rtl">
      <div className="glass-card p-8 rounded-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-medium font-serif mb-2">ברוכים הבאים לזמן סיפור</h2>
          <p className="text-muted-foreground text-sm mb-4">מסע למידה אינטראקטיבי להורים וילדים</p>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-4">
            <p className="text-green-800 text-sm">
              הצטרפו אלינו להרפתקה שבה אתם וילדכם יכולים לחקור סיפורים חדשים יחד.
              ענו על שאלות, גלו סיפורים חדשים, והפכו את הלמידה לכיף!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              אימייל
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="הכנס את האימייל שלך"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-11 bg-secondary/50 text-right"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              שם
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="הכנס את השם שלך"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="h-11 bg-secondary/50 text-right"
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">מגדר</Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4 justify-center">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">זכר</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">נקבה</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">
              גיל
            </Label>
            <Input
              id="age"
              type="number"
              min="1"
              max="120"
              placeholder="הכנס את הגיל שלך"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={isLoading}
              className="h-11 bg-secondary/50 text-right"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !email.trim() || !name.trim() || !gender || !age}
            className="w-full h-11 mt-6 group transition-all duration-300 bg-green-600 hover:bg-green-700 flex items-center justify-center"
          >
            {isLoading ? (
              "מתחבר..."
            ) : (
              <span className="flex items-center justify-center">
                המשך
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
