import storage
import usb_hid

usb_hid.enable(
    (
        usb_hid.Device.KEYBOARD,
        usb_hid.Device.MOUSE,           # ← this is what's missing
        usb_hid.Device.CONSUMER_CONTROL,
    )
)
