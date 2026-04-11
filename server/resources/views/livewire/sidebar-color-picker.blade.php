@php
    $storageKey = 'sidebar_color_' . filament()->getId();
@endphp

<div x-data="{
    isOpen: false,
    selectedColor: localStorage.getItem('{{ $storageKey }}') || '#152259',
    colors: {{ json_encode($colors) }},
    
    setColor(color) {
        this.selectedColor = color;
        localStorage.setItem('{{ $storageKey }}', color);
        this.applyColor(color);
        this.isOpen = false;
    },
    
    applyColor(color) {
        const sidebar = document.querySelector('aside.fi-sidebar');
        if (sidebar) {
            sidebar.style.backgroundColor = color;
            const darkenColor = this.darkenColor(color, 20);
            const lightenColor = this.lightenColor(color, 10);
            sidebar.style.setProperty('--sidebar-base', color);
            sidebar.style.setProperty('--sidebar-active', darkenColor);
            sidebar.style.setProperty('--sidebar-hover', lightenColor);
        }
    },
    
    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max((num >> 16) - amt, 0);
        const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
        const B = Math.max((num & 0x0000FF) - amt, 0);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },
    
    lightenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min((num >> 16) + amt, 255);
        const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
        const B = Math.min((num & 0x0000FF) + amt, 255);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },
    
    init() {
        this.applyColor(this.selectedColor);
    }
}" class="fi-sidebar-color-picker">
    <div class="relative">
        <button
            type="button"
            @click="isOpen = !isOpen"
            class="fi-sidebar-color-picker-btn"
            :title="'Change sidebar color'"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
            </svg>
            <span x-show="$store.sidebar.isOpen" class="fi-sidebar-color-picker-label">Theme Color</span>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isOpen }"
                x-show="$store.sidebar.isOpen"
            >
                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
            </svg>
        </button>

        <div
            x-show="isOpen"
            x-transition:enter="transition ease-out duration-100"
            x-transition:enter-start="transform opacity-0 scale-95"
            x-transition:enter-end="transform opacity-100 scale-100"
            x-transition:leave="transition ease-in duration-75"
            x-transition:leave-start="transform opacity-100 scale-100"
            x-transition:leave-end="transform opacity-0 scale-95"
            @click.away="isOpen = false"
            @keydown.escape.window="isOpen = false"
            class="fi-sidebar-color-picker-dropdown"
        >
            <div class="fi-sidebar-color-picker-header">
                <span>Choose Theme</span>
                <button 
                    type="button" 
                    @click="isOpen = false"
                    class="fi-sidebar-color-picker-close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div class="fi-sidebar-color-picker-grid" style="grid-template-columns: repeat(3, 1fr);">
                <template x-for="color in colors" :key="color.value">
                    <button
                        type="button"
                        @click="setColor(color.value)"
                        :title="color.name"
                        class="fi-sidebar-color-option"
                        :class="{ 'fi-sidebar-color-option-selected': selectedColor === color.value }"
                    >
                        <span 
                            class="fi-sidebar-color-swatch"
                            :style="{ backgroundColor: color.value }"
                        ></span>
                    </button>
                </template>
            </div>
        </div>
    </div>
</div>