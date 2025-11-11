'use client'

import { useState } from 'react'

export default function VideoPage() {
  const [roomName, setRoomName] = useState('')
  const [isInRoom, setIsInRoom] = useState(false)

  const createRoom = async () => {
    // TODO: Implement video room creation
    setIsInRoom(true)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Video Conferencing</h1>
      {!isInRoom ? (
        <div className="mt-8">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Room name..."
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-4 py-2"
            />
          </div>
          <button
            onClick={createRoom}
            className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Room
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Video Room: {roomName}</h2>
            <p className="mt-2 text-muted-foreground">
              Video conferencing feature coming soon. This will use WebRTC for peer-to-peer video
              calls.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

