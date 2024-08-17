import "@dxos/shell/style.css";

import { Config, Defaults, Local } from "@dxos/config";
import { runShell } from "@dxos/shell";

void runShell(new Config(Local(), Defaults()));
