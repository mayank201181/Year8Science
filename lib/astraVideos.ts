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
  },
  "breathing": {
    "poster": "/reallife-videos-astra/breathing.jpg",
    "durationSeconds": 892.68,
    "chapters": [
      {
        "title": "The lungs are not a balloon pump",
        "start": 0
      },
      {
        "title": "The airway obstacle course",
        "start": 114.24
      },
      {
        "title": "Move the space, move the air",
        "start": 228.92
      },
      {
        "title": "The tiny crossing point",
        "start": 363.0
      },
      {
        "title": "Design the best gas exchanger",
        "start": 484.64
      },
      {
        "title": "What really comes out?",
        "start": 595.88
      },
      {
        "title": "Exercise, protection and the final challenge",
        "start": 717.28
      }
    ],
    "parts": [
      {
        "src": "/reallife-videos-astra/breathing-part-00.mp4",
        "captions": "/reallife-videos-astra/breathing-part-00.vtt",
        "start": 0.0,
        "duration": 280.08
      },
      {
        "src": "/reallife-videos-astra/breathing-part-01.mp4",
        "captions": "/reallife-videos-astra/breathing-part-01.vtt",
        "start": 280.08,
        "duration": 280.0
      },
      {
        "src": "/reallife-videos-astra/breathing-part-02.mp4",
        "captions": "/reallife-videos-astra/breathing-part-02.vtt",
        "start": 560.08,
        "duration": 280.0
      },
      {
        "src": "/reallife-videos-astra/breathing-part-03.mp4",
        "captions": "/reallife-videos-astra/breathing-part-03.vtt",
        "start": 840.08,
        "duration": 52.6
      }
    ]
  },
  "digestion": {
    "poster": "/reallife-videos-astra/digestion.jpg",
    "durationSeconds": 894.8,
    "chapters": [
      {
        "title": "The sandwich cannot enter your blood",
        "start": 0
      },
      {
        "title": "Missing ingredients and different needs",
        "start": 124.0
      },
      {
        "title": "The food-test detective",
        "start": 220.16
      },
      {
        "title": "Cutting pieces versus cutting molecules",
        "start": 354.36
      },
      {
        "title": "Enzymes, acid and the bile mistake",
        "start": 483.56
      },
      {
        "title": "Across the wall and into the body",
        "start": 629.76
      },
      {
        "title": "The exit interview and quiz",
        "start": 756.36
      }
    ],
    "parts": [
      {
        "src": "/reallife-videos-astra/digestion-part-00.mp4",
        "captions": "/reallife-videos-astra/digestion-part-00.vtt",
        "start": 0.0,
        "duration": 280.08
      },
      {
        "src": "/reallife-videos-astra/digestion-part-01.mp4",
        "captions": "/reallife-videos-astra/digestion-part-01.vtt",
        "start": 280.08,
        "duration": 280.0
      },
      {
        "src": "/reallife-videos-astra/digestion-part-02.mp4",
        "captions": "/reallife-videos-astra/digestion-part-02.vtt",
        "start": 560.08,
        "duration": 280.0
      },
      {
        "src": "/reallife-videos-astra/digestion-part-03.mp4",
        "captions": "/reallife-videos-astra/digestion-part-03.vtt",
        "start": 840.08,
        "duration": 54.72
      }
    ]
  }
};
export function formatVideoTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
