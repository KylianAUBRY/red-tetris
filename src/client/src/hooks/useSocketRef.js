import { useContext } from 'react';
import { SocketContext } from '../components/GameSocketProvider';

function useSocketRef() {
	return useContext(SocketContext);
}

export default useSocketRef;
