<div
    x-data="{
        open: false,
        color: localStorage.getItem('sidebar-color') || '#152259',
        colors: [
            { label: 'Navy',    value: '#152259' },
            { label: 'Slate',   value: '#1e293b' },
            { label: 'Dark',    value: '#111827' },
            { label: 'Maroon',  value: '#4a0010' },
            { label: 'Forest',  value: '#14532d' },
            { label: 'Indigo',  value: '#1e1b4b' },
            { label: 'Teal',    value: '#134e4a' },
            { label: 'Stone',   value: '#292524' },
        ],
        apply(val) {
            this.color = val;
            localStorage.setItem('sidebar-color', val);
            document.querySelector('aside.fi-sidebar').style.setProperty('background-color', val, 'important');
            this.open = false;
        },
        init() {
            const saved = localStorage.getItem('sidebar-color');
            if (saved) {
                const el = document.querySelector('aside.fi-sidebar');
                if (el) el.style.setProperty('background-color', saved, 'important');
            }
        }
    }"
    x-init="init()"
    class="fi-sidebar-color-picker relative"
    x-show="$store.sidebar.isOpen"
>
    <button
        @click="open = !open"
        class="fi-sidebar-color-picker-btn"
        type="button"
    >
        <span class="fi-sidebar-color-swatch" :style="`background-color: ${color}`"></span>
        <span class="fi-sidebar-color-picker-label">Sidebar Color</span>
        <x-heroicon-m-chevron-up class="h-4 w-4 transition" x-bind:class="open ? '' : 'rotate-180'" />
    </button>

    <div x-show="open" x-transition class="fi-sidebar-color-picker-dropdown" @click.outside="open = false">
        <div class="fi-sidebar-color-picker-header">
            <span>Choose Sidebar Color</span>
            <button type="button" class="fi-sidebar-color-picker-close" @click="open = false">
                <x-heroicon-m-x-mark class="h-4 w-4" />
            </button>
        </div>

        <div class="fi-sidebar-color-picker-grid">
            <template x-for="c in colors" :key="c.value">
            <button
                @click="apply(c.value)"
                :title="c.label"
                class="fi-sidebar-color-option"
                :class="color === c.value ? 'fi-sidebar-color-option-selected' : ''"
                type="button"
            >
                <span class="fi-sidebar-color-swatch" :style="`background-color: ${c.value}`"></span>
            </button>
            </template>
        </div>
    </div>
</div>
