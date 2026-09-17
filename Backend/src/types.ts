export type Team = {
  id: number;
  name: string;
};

export type Meeting = {
  id: number;
  teamId: number;
  teamName: string;
  startTime: string;
  endTime: string;
  description: string;
  room: string;
};

export type MeetingInput = {
  teamId: number;
  startTime: string;
  endTime: string;
  description: string;
  room: string;
};

// A meetings row joined with its team, exactly as PostgreSQL returns it
export type MeetingRow = {
  id: number;
  team_id: number;
  team_name: string;
  start_time: Date;
  end_time: Date;
  description: string;
  room: string;
};

export function toMeeting(row: MeetingRow): Meeting {
  return {
    id: row.id,
    teamId: row.team_id,
    teamName: row.team_name,
    startTime: row.start_time.toISOString(),
    endTime: row.end_time.toISOString(),
    description: row.description,
    room: row.room,
  };
}
