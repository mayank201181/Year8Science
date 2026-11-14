/** Only completed, checked lessons belong here. Missing entries are not playable. */
export interface AstraVideo {
  poster: string;
  parts: { src: string; captions: string; start: number; duration: number }[];
  durationSeconds: number;
  chapters: { title: string; start: number }[];
}
export const ASTRA_VIDEOS: Record<string, AstraVideo> = {
  "respiration": {
    "poster": "/reallife-videos-astra/respiration.jpg",
    "durationSeconds": 986.64,
    "chapters": [
      {
        "title": "The energy emergency",
        "start": 0
      },
      {
        "title": "The recipe and the atoms",
        "start": 102.2
      },
      {
        "title": "A tour inside a cell",
        "start": 251.48
      },
      {
        "title": "Where the energy goes",
        "start": 356.28
      },
      {
        "title": "Sprint mode",
        "start": 431.32
      },
      {
        "title": "Yeast's bakery",
        "start": 541.48
      },
      {
        "title": "The comparison challenge",
        "start": 635.92
      },
      {
        "title": "Plants after dark",
        "start": 684.8
      },
      {
        "title": "Catching respiration in action",
        "start": 765.72
      },
      {
        "title": "Save the marks",
        "start": 884.32
      }
    ],
    "parts": [
      {
        "src": "/reallife-videos-astra/respiration-part-00.mp4",
        "captions": "/reallife-videos-astra/respiration-part-00.vtt",
        "start": 0.0,
        "duration": 420.08
      },
      {
        "src": "/reallife-videos-astra/respiration-part-01.mp4",
        "captions": "/reallife-videos-astra/respiration-part-01.vtt",
        "start": 420.08,
        "duration": 420.0
      },
      {
        "src": "/reallife-videos-astra/respiration-part-02.mp4",
        "captions": "/reallife-videos-astra/respiration-part-02.vtt",
        "start": 840.08,
        "duration": 146.56
      }
    ]
  },
  "photosynthesis": {
    "poster": "/reallife-videos-astra/photosynthesis.jpg",
    "durationSeconds": 856.2,
    "chapters": [
      {
        "title": "A plant with no takeaway menu",
        "start": 0
      },
      {
        "title": "The equation detective",
        "start": 97.68
      },
      {
        "title": "Inside the leaf factory",
        "start": 207.04
      },
      {
        "title": "Where does a tree get its body?",
        "start": 336.56
      },
      {
        "title": "Why more light is not always better",
        "start": 451.08
      },
      {
        "title": "The starch detective and the safety rule",
        "start": 581.96
      },
      {
        "title": "Day shift, night shift, exam rescue",
        "start": 718.28
      }
    ],
    "parts": [
      {
        "src": "/reallife-videos-astra/photosynthesis-part-00.mp4",
        "captions": "/reallife-videos-astra/photosynthesis-part-00.vtt",
        "start": 0.0,
        "duration": 280.08
      },
      {
        "src": "/reallife-videos-astra/photosynthesis-part-01.mp4",
        "captions": "/reallife-videos-astra/photosynthesis-part-01.vtt",
        "start": 280.08,
        "duration": 280.0
      },
      {
        "src": "/reallife-videos-astra/photosynthesis-part-02.mp4",
        "captions": "/reallife-videos-astra/photosynthesis-part-02.vtt",
        "start": 560.08,
        "duration": 280.0
      },
      {
        "src": "/reallife-videos-astra/photosynthesis-part-03.mp4",
        "captions": "/reallife-videos-astra/photosynthesis-part-03.vtt",
        "start": 840.08,
        "duration": 16.12
      }
    ]
  }
};
export function formatVideoTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
