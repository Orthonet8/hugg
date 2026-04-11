<?php

namespace App\Livewire;

use Livewire\Component;

class SidebarColorPicker extends Component
{
    public array $colors = [
        ['name' => 'Navy', 'value' => '#152259'],
        ['name' => 'Slate', 'value' => '#1e293b'],
        ['name' => 'Dark', 'value' => '#111827'],
        ['name' => 'Maroon', 'value' => '#4a0010'],
        ['name' => 'Forest', 'value' => '#14532d'],
        ['name' => 'Indigo', 'value' => '#1e1b4b'],
        ['name' => 'Teal', 'value' => '#134e4a'],
        ['name' => 'Stone', 'value' => '#292524'],
    ];

    public function render()
    {
        return view('livewire.sidebar-color-picker');
    }
}
