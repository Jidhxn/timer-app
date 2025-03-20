class TimerApp {
    constructor() {
        // Initialize state
        this.preset_time = parseInt(document.getElementById("preset").value) || 60;
        this.remaining_time = this.preset_time;
        this.current_mode = "question";
        this.timer_id = null;
        this.paused_time = 0;
        this.is_paused = false;
        this.is_running = false;
        
        // Statistics
        this.question_count = 0;
        this.total_question_extra = 0;
        this.total_cool_off_extra = 0;
        
        // Bind events
        this._bind_events();
    }
    
    _bind_events() {
        document.getElementById("timerDisplay").addEventListener("click", () => this.toggle_timer());
        document.getElementById("nextBtn").addEventListener("click", () => this.next_question());
        document.getElementById("coolOffBtn").addEventListener("click", () => this.cool_off());
        document.getElementById("stopBtn").addEventListener("click", () => this.stop_session());
        document.getElementById("setPreset").addEventListener("click", () => this.set_preset());
        document.getElementById("preset").addEventListener("input", (e) => this.validate_input(e));
    }

    update_display() {
        document.getElementById("timerDisplay").textContent = this.remaining_time;
        
        const mode_display = document.getElementById("mode");
        if (!this.is_running && !this.question_count) {
            mode_display.innerHTML = 'Start';
        } else if (this.current_mode === 'question') {
            mode_display.innerHTML = `SOLVING TIME<br><span style="font-size: 20px; color: #666; font-weight: normal;">QUESTION ${this.question_count + 1}</span>`;
        } else {
            mode_display.innerHTML = 'COOL OFF TIME';
        }
        
        const timer_display = document.getElementById("timerDisplay");
        if (this.is_paused) {
            timer_display.className = "timer paused";
        } else if (this.is_running) {
            timer_display.className = "timer running";
        } else {
            timer_display.className = "timer";
        }
    }

    timer_tick() {
        if (!this.is_paused && this.is_running) {
            this.remaining_time -= 1;
            if (this.remaining_time === 0) {
                this.play_alarm();
            }
            this.update_display();
            this.update_summary();
        }
    }

    play_alarm() {
        const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU");
        audio.play().catch(() => {});
    }

    update_summary() {
        const summary_text = `Summary:
Questions: ${this.question_count}
Total Time: ${this.question_count * this.preset_time + this.total_question_extra} s
Paused Time: ${this.paused_time} s
Cool Off Extra: ${this.total_cool_off_extra} s`;
        
        document.getElementById("summary").textContent = summary_text;
    }

    toggle_timer() {
        if (!this.is_running) {
            this.is_running = true;
            this.is_paused = false;
            if (this.timer_id !== null) {
                clearInterval(this.timer_id);
            }
            this.timer_id = setInterval(() => this.timer_tick(), 1000);
        } else {
            this.is_paused = !this.is_paused;
            if (this.is_paused) {
                this.paused_time += 1;
            }
        }
        this.update_display();
    }

    next_question() {
        if (this.current_mode === "question") {
            const extra = this.remaining_time < 0 ? Math.abs(this.remaining_time) : 0;
            this.total_question_extra += extra;
            this.question_count += 1;
        }
        this.is_running = false;
        this.is_paused = false;
        this.remaining_time = this.preset_time;
        this.update_display();
        this.update_summary();
    }

    cool_off() {
        if (this.current_mode === "question") {
            const extra = this.remaining_time < 0 ? Math.abs(this.remaining_time) : 0;
            this.total_question_extra += extra;
        }
        this.current_mode = "cool_off";
        this.is_running = false;
        this.is_paused = false;
        this.remaining_time = this.preset_time;
        this.update_display();
        this.update_summary();
    }

    stop_session() {
        if (this.timer_id !== null) {
            clearInterval(this.timer_id);
        }
        if (this.current_mode === "cool_off") {
            const extra = this.remaining_time < 0 ? Math.abs(this.remaining_time) : 0;
            this.total_cool_off_extra += extra;
        }
        this.is_running = false;
        this.is_paused = false;
        this.update_display();
        this.update_summary();
    }

    set_preset() {
        const input_value = document.getElementById("preset").value;
        if (!input_value) {
            alert("Please enter a number!");
            return;
        }
        
        const new_preset = parseInt(input_value);
        
        if (isNaN(new_preset) || new_preset <= 0) {
            alert("Please enter a valid positive number!");
            document.getElementById("preset").value = this.preset_time;
            return;
        }
        
        if (this.timer_id !== null) {
            clearInterval(this.timer_id);
            this.timer_id = null;
        }
        
        this.preset_time = new_preset;
        this.remaining_time = this.preset_time;
        this.is_running = false;
        this.is_paused = false;
        
        this.update_display();
        this.update_summary();
        
        alert(`Timer set to ${this.preset_time} seconds`);
    }

    validate_input(ev) {
        const value = ev.target.value;
        if (value !== "" && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
            ev.target.value = this.preset_time;
        }
    }
}

// Initialize the app
const app = new TimerApp(); 