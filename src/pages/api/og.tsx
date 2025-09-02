import { ImageResponse } from "@vercel/og";

const loadGoogleFont = async (
  name: string,
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
) => {
  const url = `https://fonts.googleapis.com/css2?family=${name}:wght@${weight}`;
  const css = await (await fetch(url)).text();
  const resource = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css);

  if (resource?.[1]) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return {
        name,
        data: await response.arrayBuffer(),
        weight,
      };
    }
  }

  throw new Error("Failed to load font data");
};

const handler = async () => {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "white",
          padding: 64,
        }}
      >
        <div tw="flex items-center justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M5.5 12.4L1.6 8.5l3.9-3.9l3.9 3.9zM9 22v-5q-1.525-.125-3.025-.363T3 16l.5-2q2.1.575 4.213.788T12 15t4.288-.213T20.5 14l.5 2q-1.475.4-2.975.638T15 17v5zM5.5 9.6l1.1-1.1l-1.1-1.1l-1.1 1.1zM12 7q-1.25 0-2.125-.875T9 4t.875-2.125T12 1t2.125.875T15 4t-.875 2.125T12 7m0 7q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-9q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5m5.05 7l-1.7-3l1.7-3h3.4l1.7 3l-1.7 3zm1.15-2h1.1l.55-1l-.55-1h-1.1l-.55 1zm.55-1"
            />
          </svg>
          <div tw="text-zinc-500 text-2xl">T3 Stack</div>
        </div>
        <div tw="text-8xl font-bold">T3 - App Exploration</div>
        <div tw="flex items-center justify-between text-2xl">
          <div>Alexandru Tofan</div>
          <div tw="text-zinc-500">{new Date().getFullYear().toString()}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        await loadGoogleFont("Geist", 400),
        await loadGoogleFont("Geist", 700),
      ],
    },
  );
};

export const config = {
  runtime: "edge",
};

export default handler;
