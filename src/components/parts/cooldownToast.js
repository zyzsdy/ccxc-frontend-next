import { ref } from '@vue/reactivity';
import { Toast } from 'bootstrap';
import sleep from '../../utils/Sleep';

export default function useCooldownToast() {
    const cooldownRemainSeconds = ref(0);
    const showCooldownToast = () => {
        let toastEl = document.getElementById("coolDownToast");
        let toast = new Toast(toastEl);
        toast.show();
    }

    const startCountdown = async () => {
        cooldownRemainSeconds.value -= 1;
        await sleep(1000);
    
        if (cooldownRemainSeconds.value <= 0) {
            let toastEl = document.getElementById("coolDownToast");
            let toast = new Toast(toastEl);
            toast.hide();
        }
    
        startCountdown();
    }

    return {
        cooldownRemainSeconds,
        showCooldownToast,
        startCountdown
    }
}