// components/SmartSections/CountdownTimer.jsx
"use client";

import { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate, accentColor = "var(--accent)" }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const hasExpired = timeLeft.days === 0 && timeLeft.hours === 0 && 
                     timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (hasExpired) {
    return (
      <div className="mt-4 p-3 bg-red-50 rounded-lg text-center">
        <p className="text-sm text-red-600 font-medium">Expired</p>
      </div>
    );
  }

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds }
  ];

  return (
    <div className="mt-4">
      <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wider">Ends in:</p>
      <div className="grid grid-cols-4 gap-2">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="text-center">
            <div 
              className="p-2 rounded-lg bg-gray-100"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <span className="text-xl font-bold" style={{ color: accentColor }}>
                {String(unit.value).padStart(2, "0")}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-1">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;