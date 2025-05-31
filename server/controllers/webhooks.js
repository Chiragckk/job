import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString("utf8"); // raw buffer as string
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers); // throws if invalid

    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: ""
        };
        await User.create(userData);
        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(400).json({ message: "Unhandled event type" });
    }
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ error: "Webhook verification failed" });
  }
};

export default clerkWebhooks;
