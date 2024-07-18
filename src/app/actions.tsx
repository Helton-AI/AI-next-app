'use server';

import { streamUI } from "ai/rsc";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: "https://api.openai-next.com/v1",
});

// const LoadingComponent = () => <div className="animate-pulse p-4">getting weather...</div>;

const getWeather = async (location: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return "82°F️ ☀️";
};

interface WeatherProps {
    location: string;
    weather: string;
}

const WeatherComponent = (props: WeatherProps) => (
    <div className="border border-neutral-200 p-4 rounded-lg whitespace-no-wrap">
        The weather1 in {props.location} is {props.weather}
    </div>
);

export async function streamComponent() {
    const result = await streamUI({
      model: openai('gpt-4o'),
      prompt: 'Get the weather for Shanghai',
      text: ({ content }) => <div>{content}</div>,
      tools: {
        getWeather: {
          description: 'Get the weather for a location',
          parameters: z.object({
            location: z.string(),
          }),
          generate: async function* ({ location }) {
            // yield <LoadingComponent />;
            yield <WeatherComponent weather={''} location={location} />;
            const weather = await getWeather(location);
            return <WeatherComponent weather={weather} location={location} />;
          },
        },
      },
    });
  
    return result.value;
  }