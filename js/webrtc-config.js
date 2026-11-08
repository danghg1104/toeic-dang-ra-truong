/**
 * WebRTC Production STUN & TURN ICE Configuration
 * Supports global P2P traversal across Symmetric NATs & Firewalls
 */

export const RTC_ICE_CONFIG = {
    iceServers: [
        // 1. Google Public STUN Cluster (Primary low-latency STUN discovery)
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },

        // 2. Cloudflare Anycast STUN
        { urls: "stun:stun.cloudflare.com:3478" },

        // 3. OpenRelay / Metered Free Community TURN Servers (Relays UDP/TCP media)
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject"
        },
        {
            urls: "turns:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject"
        }
    ],
    iceCandidatePoolSize: 10
};

/**
 * Diagnostic helper to test STUN/TURN connectivity and classify candidates
 */
export async function testStunTurnConnectivity(onCandidateFound) {
    return new Promise((resolve) => {
        const pc = new RTCPeerConnection(RTC_ICE_CONFIG);
        const results = {
            host: 0,
            srflx: 0, // STUN (Server Reflexive)
            relay: 0, // TURN (Relayed)
            candidates: []
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const type = event.candidate.type;
                if (type === 'host') results.host++;
                else if (type === 'srflx') results.srflx++;
                else if (type === 'relay') results.relay++;

                results.candidates.push({
                    type: event.candidate.type,
                    protocol: event.candidate.protocol,
                    address: event.candidate.address,
                    port: event.candidate.port
                });

                if (onCandidateFound) onCandidateFound(event.candidate, results);
            } else {
                // ICE gathering finished
                pc.close();
                resolve(results);
            }
        };

        // Create dummy data channel to trigger ICE gathering
        pc.createDataChannel('ice-check');
        pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(() => {
            resolve(results);
        });

        // Safety timeout
        setTimeout(() => {
            try { pc.close(); } catch(e) {}
            resolve(results);
        }, 3500);
    });
}
