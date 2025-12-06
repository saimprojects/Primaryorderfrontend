import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate, compact = false }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (compact) {
        return (
            <div className="flex items-center gap-2 text-lg font-bold text-[#FF5C00]">
                <span className="bg-white px-3 py-1 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                :
                <span className="bg-white px-3 py-1 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                :
                <span className="bg-white px-3 py-1 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
        );
    }

    return (
        <div className="flex gap-4">
            {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
            ].map((item) => (
                <div key={item.label} className="text-center">
                    <div className="bg-black bg-opacity-30 text-white text-2xl md:text-4xl font-bold px-4 py-3 rounded-xl min-w-[70px]">
                        {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-gray-300 text-sm mt-2">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

export default CountdownTimer;