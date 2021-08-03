import { ref } from '@vue/reactivity';
import gConst from '../../globalconst';

export default function useJumpHelper(router) {
    const skipPrologue = ref(false);
    const checkSkipSwitcher = () => {
        if (skipPrologue.value == false) {
            gConst.status.skipPrologue = true;
            localStorage.setItem("skipPrologue", "on");
        } else {
            gConst.status.skipPrologue = false;
            localStorage.setItem("skipPrologue", "off");
        }
    }
    
    const goPrologue = () => {
        router.push("/prologue");
    }
    
    const goCorridor = () => {
        router.push("/corridor");
    }
    
    const goAnalysisRoom = () => {
        router.push("/analysis-room");
    }
    
    const goCommOffice = () => {
        router.push("/commissioner-office")
    }

    return {
        skipPrologue,
        checkSkipSwitcher,
        goPrologue,
        goCorridor,
        goAnalysisRoom,
        goCommOffice
    }
}