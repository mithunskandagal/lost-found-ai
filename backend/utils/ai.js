function fallbackAnalysis(item) {
    return {
        category: item.category || "Other",
        tags: [item.category, item.color, item.brand].filter(Boolean),
        summary: `${item.title || "Item"}. ${item.description || ""}`.slice(0, 300)
    };
}

export async function analyzeItem(item, imagePath = null) {
    // Normal analysis without AI
    return fallbackAnalysis(item);
}

export async function rankMatches(target, candidates) {
    if (!candidates || candidates.length === 0) {
        return [];
    }

    return candidates.map((item) => {
        let score = 0;
        let reasons = [];

        // Category match
        if (
            target.category &&
            item.category &&
            target.category.toLowerCase() === item.category.toLowerCase()
        ) {
            score += 30;
            reasons.push("same category");
        }

        // Color match
        if (
            target.color &&
            item.color &&
            target.color.toLowerCase() === item.color.toLowerCase()
        ) {
            score += 20;
            reasons.push("same color");
        }

        // Brand match
        if (
            target.brand &&
            item.brand &&
            target.brand.toLowerCase() === item.brand.toLowerCase()
        ) {
            score += 20;
            reasons.push("same brand");
        }

        // Location match
        if (
            target.location &&
            item.location &&
            target.location.toLowerCase() === item.location.toLowerCase()
        ) {
            score += 20;
            reasons.push("same location");
        }

        // Description word matching
        if (target.description && item.description) {
            const targetWords = target.description.toLowerCase().split(/\s+/);
            const itemDescription = item.description.toLowerCase();

            let commonWords = 0;

            targetWords.forEach((word) => {
                if (word.length > 3 && itemDescription.includes(word)) {
                    commonWords++;
                }
            });

            if (commonWords > 0) {
                score += Math.min(commonWords * 2, 10);
                reasons.push("similar description");
            }
        }

        return {
            itemId: item._id,
            score: Math.min(score, 100),
            reason:
                reasons.length > 0
                    ? reasons.join(", ")
                    : "No strong similarity found."
        };
    }).sort((a, b) => b.score - a.score);
}