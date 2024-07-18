"use server";

import { streamUI, createAI } from "ai/rsc";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: "https://api.openai-next.com/v1",
});

const LoadingComponent = () => <div className="animate-pulse p-4 border-2 border-neutral-800 rounded-lg ">getting temperature...</div>;
const LoadingIcon = () => <div className="border-gray-300 h-4 w-4 animate-spin rounded-full border-2 border-t-blue-600" />;

const getTemperature = async (location: string) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const res = await fetch(
        `https://api.seniverse.com/v3/weather/now.json?${new URLSearchParams({
            key: process.env.WEATHER_API_KEY!,
            location,
            language: "zh-Hans",
            unit: "c",
        })}`
    );
    const json = await res.json();
    return `${json.results[0].now.temperature}°C`;
};

interface TemperatureProps {
    location: string;
    temperature?: string;
}

const TemperatureComponent = (props: TemperatureProps) => (
    <div className="flex items-center border-2 border-neutral-800 p-4 rounded-lg">
        The temperature of {props.location} is
        {props.temperature ? (
            <>&nbsp;{props.temperature}</>
        ) : (
            <>
                &nbsp;
                <LoadingIcon />
            </>
        )}
    </div>
);

const ErrorComponent = () => <div className="border-2 border-neutral-800 p-4 rounded-lg">The city name is not supported, please enter another</div>;

export async function submitMessage(input: string) {
    const result = await streamUI({
        model: openai("gpt-4o"),
        messages: [{ role: "user", content: `Get the temperature for ${input}` }],
        text: ({ content, done }) => {
            if (done) {
                return <div className="border-2 border-neutral-800 p-4 rounded-lg">{content}</div>;
            }
            return <LoadingComponent />;
        },
        tools: {
            getTemperature: {
                description: "Get the temperature for a location",
                parameters: z.object({
                    location: z.string(),
                }),
                generate: async function* ({ location }) {
                    yield <LoadingComponent />;
                    try {
                        const temperature = await getTemperature(location);
                        return <TemperatureComponent temperature={temperature} location={location} />;
                    } catch (error) {
                        return <ErrorComponent />;
                    }
                },
            },
        },
    });

    return result.value;
}

export const AI = createAI({
    actions: {
        submitMessage,
    },
    initialAIState: [],
    initialUIState: [],
});
