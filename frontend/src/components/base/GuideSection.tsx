import React from "react";
import Image from "next/image";

const steps = [
  {
    step: "Step 1",
    title: "Get Signed Up",
    image: "/images/Step 1.png",
    direction: "left",
  },
  {
    step: "Step 2",
    title: 'Click on "Create Chat" option or choose from the existing "Chats"',
    image: "/images/Step 3.png",
    direction: "right",
  },
  {
    step: "Step 3",
    title:
      "Click on the chat and copy link. Paste it in any browser and Hurray! your Anonymous Chat-Room is created",
    image: "/images/Step 2.png",
    direction: "left",
  },
];

export default function GuideSection() {
  return (
    <section id="guide" className="px-6 py-20 bg-background text-foreground">
      <h2 className="text-4xl font-extrabold text-center mb-20">How It Works</h2>
      <div className="space-y-24">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              step.direction === "right" ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="md:w-1/2 w-full flex justify-center">
              <Image
                src={step.image}
                alt={step.title}
                width={800}
                height={500}
                className="w-full max-w-2xl rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text */}
            <div className="md:w-1/2 w-full px-4 text-center md:text-left">
              <h3 className="text-lg text-muted-foreground mb-2 font-medium">
                {step.step}
              </h3>
              <p className="text-2xl font-bold">{step.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
