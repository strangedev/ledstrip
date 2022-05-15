package animation

import (
	"encoding/json"
	"fmt"
	"time"
)

type Duration struct {
	time.Duration
}

func (d *Duration) UnmarshalJSON(b []byte) (err error) {
	if b[0] == '"' {
		humanReadable := string(b[1 : len(b)-1])
		d.Duration, err = time.ParseDuration(humanReadable)

		return
	}

	var nanos int64
	nanos, err = json.Number(string(b)).Int64()
	d.Duration = time.Duration(nanos)

	return
}

func (d Duration) MarshalJSON() (b []byte, err error) {
	return []byte(fmt.Sprintf(`"%v"`, int(d.Duration))), nil
}
