#include "ConfigApplier.h"
#include <Utilities/logging.h>
namespace ConfigApplier {

int apply(const ParseResult& config, PinManager* pinManager) {
    if (pinManager == nullptr) {
        return 0;
    }

    if (!config.success) {
        WARNING("[ConfigApplier] Config not valid, skipping.");
        return 0;
    }

    int applied = 0;

    for (int i = 0; i < MAX_SEGMENTS; i++) {
        const SegmentConfig& seg = config.segments[i];
        if (!seg.valid) continue;

        SegmentType sType = SegmentType::Output;
        if (strcmp(seg.type, "input") == 0) {
            sType = SegmentType::Input;
        }

        bool added = pinManager->addSegment(seg.id, sType, seg.pin, seg.autoOffDelay, seg.rule);
        if (added) {
            pinManager->setStateById(seg.id, seg.value);
            applied++;
            INFOF("[ConfigApplier] Pin %d registered (id=%s, value=%d)", seg.pin, seg.id, seg.value);
        } else {
            // Segment already exists (e.g. from offline NVS boot) -> update state, auto-off & rules
            pinManager->updateSegmentRule(seg.id, seg.rule);
            pinManager->setAutoOffDelayByPin(seg.pin, seg.autoOffDelay);
            pinManager->setPinState(seg.pin, seg.value);
            applied++;
            INFOF("[ConfigApplier] Pin %d updated (id=%s, value=%d)", seg.pin, seg.id, seg.value);
        }
    }

    INFOF("[ConfigApplier] Applied %d GPIO segments.", applied);
    return applied;
}

}  // namespace ConfigApplier
