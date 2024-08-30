import { useContext } from 'react';
import { SocketContext } from '../components/SocketProvider';

function useSocket() {
	return useContext(SocketContext);
}

export default useSocket;
