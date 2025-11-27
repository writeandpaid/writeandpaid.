'use client';

import { JoinForm as JoinFormClient } from './join-form-client';

export function JoinForm() {
  // The server actions are not needed here as they are imported directly in the client component.
  return <JoinFormClient />;
}
