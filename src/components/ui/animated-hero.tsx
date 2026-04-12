"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroProps = {
  waitlistCount?: number | null;
  onCallClick?: () => void;
  onSignupClick?: () => void;
};

function Hero({ waitlistCount, onCallClick, onSignupClick }: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["delivered", "planned", "sorted", "ready", "done"],
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              Read our launch article <MoveRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-center text-5xl font-regular tracking-tighter md:text-7xl">
              <span className="text-spektr-cyan-50">
                From saved recipe to groceries
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="max-w-2xl text-center text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl">
              From saved recipe to groceries delivered.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="gap-4"
              variant="outline"
              onClick={onCallClick}
            >
              Jump on a call <PhoneCall className="h-4 w-4" />
            </Button>
            <Button size="lg" className="gap-4" onClick={onSignupClick}>
              Sign up here <MoveRight className="h-4 w-4" />
            </Button>
          </div>

          {waitlistCount !== null && waitlistCount !== undefined && waitlistCount > 0 && (
            <p className="text-center text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                {waitlistCount.toLocaleString()}
              </span>{" "}
              people already on the list
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { Hero };
