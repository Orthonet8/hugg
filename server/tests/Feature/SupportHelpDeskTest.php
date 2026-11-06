<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SupportHelpDeskTest extends TestCase
{
    use RefreshDatabase;

    protected Member $member;
    protected User $supporter;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->member = Member::firstOrCreate(
            ['email_or_username' => 'test_member'],
            [
                'full_name' => 'Test Member',
                'password' => 'password123',
                'batch' => '2018',
                'is_active' => true,
            ]
        );

        $this->supporter = User::firstOrCreate(
            ['username' => 'test_supporter'],
            [
                'name' => 'Supporter Brother',
                'password' => 'password123',
                'phone' => '+251911002233',
                'telegram_username' => 'brother_supporter',
                'is_supporter' => true,
                'support_sectors' => ['Spiritual & Prayer', 'Academic & Campus'],
                'support_bio' => 'Ready to support and guide students in campus life.',
            ]
        );

        $this->token = 'Bearer ' . $this->member->email_or_username . ':randomtoken123456';
    }

    public function test_can_fetch_supporters_list(): void
    {
        $response = $this->getJson('/api/support/supporters');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'supporters' => [
                    '*' => [
                        'id',
                        'name',
                        'phone',
                        'telegram_username',
                        'support_sectors',
                        'support_bio',
                    ],
                ],
            ]);
    }

    public function test_can_filter_supporters_by_sector(): void
    {
        $response = $this->getJson('/api/support/supporters?sector=' . urlencode('Spiritual & Prayer'));

        $response->assertStatus(200);
        $supporters = $response->json('supporters');
        $this->assertNotEmpty($supporters);
        $this->assertContains('Spiritual & Prayer', $supporters[0]['support_sectors']);
    }

    public function test_member_can_create_ticket_with_attachment(): void
    {
        $file = UploadedFile::fake()->image('question.jpg');

        $response = $this->withHeader('Authorization', $this->token)
            ->postJson('/api/support/tickets', [
                'subject' => 'Need guidance on balancing campus and church',
                'sector' => 'Spiritual & Prayer',
                'message' => 'Hello brother, I am having a hard time balancing study and service.',
                'attachment' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('ticket.subject', 'Need guidance on balancing campus and church')
            ->assertJsonPath('ticket.sector', 'Spiritual & Prayer');

        $ticketId = $response->json('ticket.id');

        $this->assertDatabaseHas('support_tickets', [
            'id' => $ticketId,
            'member_id' => $this->member->id,
        ]);

        $this->assertDatabaseHas('support_messages', [
            'ticket_id' => $ticketId,
            'sender_type' => 'member',
            'attachment_type' => 'image',
        ]);
    }

    public function test_member_can_fetch_their_tickets_and_details(): void
    {
        $ticket = SupportTicket::create([
            'member_id' => $this->member->id,
            'assigned_user_id' => $this->supporter->id,
            'subject' => 'Academic question',
            'sector' => 'Academic & Campus',
            'status' => 'open',
            'priority' => 'medium',
        ]);

        $response = $this->withHeader('Authorization', $this->token)
            ->getJson('/api/support/tickets');

        $response->assertStatus(200)
            ->assertJsonFragment(['subject' => 'Academic question']);

        $detailResponse = $this->withHeader('Authorization', $this->token)
            ->getJson('/api/support/tickets/' . $ticket->id);

        $detailResponse->assertStatus(200)
            ->assertJsonPath('ticket.id', $ticket->id)
            ->assertJsonPath('ticket.supporter.name', $this->supporter->name);
    }

    public function test_member_can_send_reply_message_in_ticket(): void
    {
        $ticket = SupportTicket::create([
            'member_id' => $this->member->id,
            'assigned_user_id' => $this->supporter->id,
            'subject' => 'Counseling session inquiry',
            'sector' => 'Counseling & Personal',
            'status' => 'in_progress',
        ]);

        $response = $this->withHeader('Authorization', $this->token)
            ->postJson("/api/support/tickets/{$ticket->id}/messages", [
                'message' => 'Thank you for following up!',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('chat_message.message', 'Thank you for following up!')
            ->assertJsonPath('chat_message.sender_type', 'member');

        $this->assertDatabaseHas('support_messages', [
            'ticket_id' => $ticket->id,
            'message' => 'Thank you for following up!',
            'sender_type' => 'member',
        ]);
    }
}
