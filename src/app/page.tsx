"use client";

import { useState } from "react";
import { streamComponent } from "./actions";

export default function Page() {
    const [component, setComponent] = useState<React.ReactNode>();

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div style={{height:'64px'}}>{component}</div>
            <div>
                <button
                    style={{ background: "#ccc", color: "black", marginTop: "1rem", padding: "0 1rem", borderRadius: "1rem" }}
                    onClick={async () => {
                        setComponent(await streamComponent());
                    }}
                >
                    Stream Component
                </button>
            </div>
        </div>
    );
}
