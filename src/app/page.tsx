"use client";

import { useState } from "react";
import { useActions } from "ai/rsc";

export default function Page() {
    const [content, setContent] = useState<React.ReactNode>();
    const [component, setComponent] = useState<React.ReactNode>();
    const { submitMessage } = useActions();

    return (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center gap-8 p-16 border-2 border-black bg-white shadow-md bg-clip-border rounded-xl">
            <div>Enter the city name and get the temperature</div>
            <input
                placeholder="Input area"
                type="text"
                className="px-4 py-2 bg-transparent border-2 border-black rounded-lg w-96 text-black placeholder-gray-400"
                onChange={(e) => setContent(e.target.value)}
            />
            <div>
                <button
                    className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                    onClick={async () => {
                        setComponent(await submitMessage(content));
                    }}
                >
                    submit
                </button>
            </div>
            {component}
            </div>
        </div>
    );
}
