import React, { useState } from 'react';
import { ChatRoom } from '../../hooks/useChatSocket';
import { Box, List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Badge, TextField, Typography, InputAdornment, Paper, Chip, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { Search, MessageSquare, Circle } from 'lucide-react';
import { Add } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { styled } from '@mui/material/styles';

interface ChatListProps {
    rooms: ChatRoom[];
    selectedRoomId?: string;
    onSelectRoom: (roomId: string) => void;
    isLoading?: boolean;
    currentUserId: string;
    onNewChat?: () => void;
}

const StyledListItemButton = styled(ListItemButton)<{ selected?: boolean }>(({ theme, selected }) => ({
    borderLeft: selected ? `4px solid #FFD700` : '4px solid transparent',
    backgroundColor: selected
        ? theme.palette.mode === 'dark'
            ? 'rgba(255, 215, 0, 0.15)'
            : 'rgba(255, 215, 0, 0.08)'
        : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    transition: 'all 0.2s ease',
    padding: theme.spacing(2),
}));

const SearchField = styled(TextField)(() => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#fff',
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 215, 0, 0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FFD700',
        },
        '& input::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
            opacity: 1,
        },
    },
}));

const ChatList: React.FC<ChatListProps> = ({
    rooms,
    selectedRoomId,
    onSelectRoom,
    isLoading = false,
    currentUserId,
    onNewChat,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRooms = rooms.filter((room) => {
        const otherParticipant = room.participantDetails.find(
            (p) => p.memberId !== currentUserId
        );
        return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const formatTime = (date: Date | string | undefined) => {
        if (!date) return '';
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch {
            return '';
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                bgcolor: '#0f1e36',
                borderRight: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
        >
            {/* Header */}
            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#FFD700',
                        }}
                    >
                        Chat
                    </Typography>

                    {onNewChat && (
                        <Tooltip title="Start New Chat">
                            <IconButton
                                onClick={onNewChat}
                                sx={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #e6c200 100%)',
                                    color: '#0D2658',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #e6c200 0%, #cca000 100%)',
                                    },
                                }}
                            >
                                <Add />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                {/* Search Bar */}
                <SearchField
                    fullWidth
                    size="small"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} color="rgba(255, 255, 255, 0.5)" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Chat List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredRooms.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            px: 4,
                            py: 12,
                            textAlign: 'center',
                        }}
                    >
                        <Paper
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.2) 100%)',
                                mb: 2,
                                border: '1px solid rgba(255,215,0,0.2)'
                            }}
                        >
                            <MessageSquare size={32} color="#FFD700" />
                        </Paper>
                        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                            No conversations yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} maxWidth={300}>
                            {searchQuery
                                ? 'No results found for your search'
                                : 'Start a new conversation to get started'}
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {filteredRooms.map((room) => {
                            const otherParticipant = room.participantDetails.find(
                                (p) => p.memberId !== currentUserId
                            );

                            if (!otherParticipant) return null;

                            const isSelected = room.roomId === selectedRoomId;
                            const hasUnread = (room.unreadCount || 0) > 0;

                            return (
                                <StyledListItemButton
                                    key={room.roomId}
                                    selected={isSelected}
                                    onClick={() => onSelectRoom(room.roomId)}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={
                                                <Circle
                                                    size={12}
                                                    fill="#4caf50"
                                                    color="#4caf50"
                                                    style={{ border: '2px solid white', borderRadius: '50%' }}
                                                />
                                            }
                                        >
                                            <Avatar
                                                sx={{
                                                    background:
                                                        otherParticipant.role === 'admin'
                                                            ? 'linear-gradient(135deg, #FFD700 0%, #e6c200 100%)'
                                                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                                                    fontWeight: 600,
                                                    color: otherParticipant.role === 'admin' ? '#050916' : '#FFD700',
                                                    border: otherParticipant.role !== 'admin' ? '1px solid rgba(255, 215, 0, 0.3)' : 'none'
                                                }}
                                            >
                                                {otherParticipant.name.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    noWrap
                                                    sx={{
                                                        fontWeight: hasUnread ? 700 : 500,
                                                        flexGrow: 1,
                                                        color: '#fff'
                                                    }}
                                                >
                                                    {otherParticipant.name}
                                                </Typography>
                                                {otherParticipant.role === 'admin' && (
                                                    <Chip
                                                        label="Admin"
                                                        size="small"
                                                        sx={{
                                                            height: 18,
                                                            fontSize: '10px',
                                                            bgcolor: 'rgba(255, 215, 0, 0.2)',
                                                            color: '#FFD700',
                                                            border: '1px solid rgba(255, 215, 0, 0.5)',
                                                        }}
                                                    />
                                                )}
                                                {room.lastMessageTime && (
                                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                                        {formatTime(room.lastMessageTime)}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: hasUnread ? 500 : 400,
                                                        flexGrow: 1,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        color: hasUnread ? '#fff' : 'rgba(255, 255, 255, 0.6)'
                                                    }}
                                                >
                                                    {room.lastMessage || 'No messages yet'}
                                                </Typography>
                                                {hasUnread && (
                                                    <Badge
                                                        badgeContent={room.unreadCount}
                                                        color="primary"
                                                        sx={{
                                                            ml: 1,
                                                            '& .MuiBadge-badge': {
                                                                background: 'linear-gradient(135deg, #FFD700 0%, #e6c200 100%)',
                                                                color: '#050916',
                                                                fontWeight: 700,
                                                            },
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        }
                                    />
                                </StyledListItemButton>
                            );
                        })}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default ChatList;
