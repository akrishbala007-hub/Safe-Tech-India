export const sendWhatsAppNotification = (
    phone: string,
    message: string,
    type: 'admin' | 'direct' = 'direct'
) => {
    // SafeTech Admin Phone (Example: Replace with real admin number)
    const ADMIN_PHONE = '919000000000'; // REPLACE WITH REAL ADMIN NUMBER

    const targetPhone = type === 'admin' ? ADMIN_PHONE : phone;
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

    // Open in new tab
    if (typeof window !== 'undefined') {
        window.open(url, '_blank');
    }
};
