import React, { createContext, useMemo } from 'react';

import { io } from 'socket.io-client';
import { PROD, PORT } from '../../../constants';

export const SocketContext = createContext(null);

export default function SocketProvider({ auth, socketSetup, children }) {
	const URL = PROD ? undefined : `http://localhost:${PORT}`;
	const socket = useMemo(() => {
		return io(URL, {
			auth,
			autoConnect: false,
		});
	}, [URL, auth]);

	if (socketSetup) {
		socketSetup(socket);
	}

	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
}
