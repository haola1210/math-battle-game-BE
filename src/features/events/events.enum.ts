export enum BULLET_ACTION {
  FLYING = 'BULLET_FLYING',
  SYNC_FLYING = 'SYNC_BULLET_FLYING',
  STOP = 'BULLET_STOP',
  SYNC_STOP = 'SYNC_BULLET_STOP',
  COLLIDED_OBSTACLE = 'COLLIDED_OBSTACLE',
  SYNC_COLLIDED_OBSTACLE = 'SYNC_COLLIDED_OBSTACLE',
}

export enum USER_ACTION {
  CREATE_ROOM = 'CREATE_ROOM',
  CREATE_ROOM_FEEDBACK = 'CREATE_ROOM_FEEDBACK',
  CREATE_ROOM_ERROR = 'CREATE_ROOM_ERROR',
  JOIN_ROOM = 'JOIN_ROOM',
  JOIN_ROOM_FEEDBACK_LOBBY = 'JOIN_ROOM_FEEDBACK_LOBBY',
  JOIN_ROOM_FEEDBACK_ROOM = 'JOIN_ROOM_FEEDBACK_ROOM',
  JOIN_ROOM_ERROR = 'JOIN_ROOM_ERROR',
  USER_JOIN_ROOM = 'USER_JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
  LEAVE_ROOM_FEEDBACK_ROOM = 'LEAVE_ROOM_FEEDBACK_ROOM',
  LEAVE_ROOM_FEEDBACK_LOBBY = 'LEAVE_ROOM_FEEDBACK_LOBBY',
  LEAVE_ROOM_ERROR = 'LEAVE_ROOM_ERROR',
  USER_CHANGE_TEAM = 'USER_CHANGE_TEAM',
  USER_CHANGE_TEAM_FEEDBACK = 'USER_CHANGE_TEAM_FEEDBACK',
  USER_CHANGE_TEAM_ERROR = 'USER_CHANGE_TEAM_ERROR',
}
