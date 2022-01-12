import type { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Document } from 'mongoose';
import assertLoggedIn from '../../../graphql/assertLoggedIn';
import { AidRequestModel } from '../AidRequestModel';
import type {
  AidRequestActionOption,
  AidRequestType,
} from '../AidRequestModelTypes';

const actionsAvailable: ObjectTypeComposerFieldConfigAsObjectDefinition<
  Document<string, unknown, AidRequestType>,
  Express.Request,
  Record<string, never>
> = {
  resolve: async (
    { _id }: Document<string, unknown, AidRequestType>,
    _args: Record<string, never>,
    req: Express.Request,
  ): Promise<Array<AidRequestActionOption>> => {
    const user = assertLoggedIn(req, 'actionsAvailable');
    const aidRequest = await AidRequestModel.findById(_id);
    if (aidRequest == null) {
      return [];
    }
    const options: Array<AidRequestActionOption> = [
      aidRequest.completed
        ? markAsNotCompletedOption()
        : markAsCompletedOption(),
      aidRequest.whoIsWorkingOnIt.includes(user._id)
        ? iAmNotWorkingOnItOption()
        : iAmWorkingOnItOption(),
    ];
    return options;
  },
  type: '[AidRequestActionOption]',
};

function markAsNotCompletedOption(): AidRequestActionOption {
  return {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAQAAAD/5HvMAAAETklEQVRo3u2Zz0+URxjHR1c3EYKYWunGpq3a9UAiXlyrF6EHiOKhF9I/wTSc1pQDRg+Q9Fp6ggvJZg3dA0cClyaSIByMB5M919Bsq0YUQ6QmGAvop4cS+sy878w77w/Fwz5Hnu88fPadmed5ZkappjWtaR+pcYASZWosUKfBJvCUBvepMkwfLR8SpZ1B7rKBy96wSJmO9P8sx3dO/yWmeI2vbTJLdzqcaWDY4u1iniS2RE8aHMKQ6GCSbZJbjUJynBAkTvIX6ewlA/GAfjECmEineGQoVpnhJv10coKcUhQocpUy06xaoMbJ+wN9yR8RSF/zeMfziiq97HdEu8gEayFI87RliVTkMeuMcsQrXitDrASQHnAsS6Sv+CTWQmhjjK0AUpZfKcHuPcdyYOLye4t0mDlzeccZ/j6QclSMmHGSAOcDS3E4gxpYMfKSf6pkMmTDZvGV9Imr+Q48aykS6ZHateX9zrPGccea/tMjlbQksOQzpFtD+CdzpDEtXnRzwpSQr9PFw3RIfM9RI1XK7D0bPcuyExxVis/TIHGNt9QNpCERayuiq2RQiP+mXak0SFzjLYCORKtWdsvuEAtCWt39ayKkXZwg0oSItOgKcVCbsF7hiY2k4QD8JnwXtG3T4pehn5PTfLGQAjjP6BTefTwXvj57mLKQzQS83khuHKWU0trlG3agmpDdCvF7IUXjKMX1sLUaDCWPOZdDFaeikGilEYWjFFeE4p4dqC5kZ0L8P/A730QineRPN45SFMX4hh1IniuOh+C8Ax7GQLLgKMVRMfqFHUhu+kOhOMRAsuIoRV7eA9iB3ghZ3oLjj9TpSAuHxMgNu+yFkOn1Z8T49x5IzrR5XIx7ZJfJ/VE0fJkicUaMqttl94TsSsCbIRKX5aHILqsK2fUQfxjSShIkbnn11twQsulQhYn0TFvs/p3AjFcDQp9WXPd5ISXovclpxfW8Xdii9dAXLKrUSNoP3+CgS7oopBNWVUokbgvdgvtjygZkjVZvpCd8692cHOGVUA26gTq0c9OQQzmi4Zz275f4SZuw9qj1PyvkK66bnF2kJ5z275f4VPs+U3EPimNO7YjE8UPiC9Gc4HWLzZJ2bio5tT9KHE+k//ulO35pvUdLdsuRs6wSIm1z1jdkTQs3p58/MkOa9A9Y4KUWrhL7SsEH6bM4AQeMcJXsv1Lc3zhuhJvj8J4ikQ+8/Sxzbm+R2nhghNtiLMal939PWlleeXEsgAQrDNlrnFGzRlnP+GKQttBHuzUmuOgYtZ9eqlqJyHQtjVvCrjJNmasUKShFjhN00s9NZqzPU5ntuAEjL2VhKZEKRvaOZ9tMUsr8wYIerez62zxd7+sNRdHNLJveKK+Z4pLzWac//RuKooMyi9o9QNA2uMtgsE8wkCrhJ5tkWC30MUyV+zR4CmzSoM4CNcqUOODx+HXb9Wr7AW0H6dePBGcH6ee43UPTmuZr/wJGvfAt/ufspwAAAABJRU5ErkJggg==',
    input: {
      action: 'Remove',
      details: {
        event: 'Completed',
      },
    },
    message: 'Mark as incomplete',
  };
}

function markAsCompletedOption(): AidRequestActionOption {
  return {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAs0lEQVR4Ae3QMQ0CARAEwG/p0YE8WpQhAh2IWAoo2YTkCpLLjIQ52AgAAACAJKeDmnNO8khyOyo5Hz1JTk+S05PkCJIjZ06OHDly5MiRI0fOdnLkyElySXJPcj6+kvPM26MnyUlPkpOStD2nS3JNUZK25nRJbvOkec7+pHHO/qRBzv6k/TnTpP05g6T9OYOk/TnzpP05w6TfcyT1HEk9R5KcniTn9yQ5PUlOT/p7DgAAAAAv9LNMJLXr9eIAAAAASUVORK5CYII=',
    input: {
      action: 'Add',
      details: {
        event: 'Completed',
      },
    },
    message: 'Mark as complete',
  };
}

function iAmWorkingOnItOption(): AidRequestActionOption {
  return {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHqADAAQAAAABAAAAHgAAAADKQTcFAAAEDklEQVRIDa2WS6iVVRTHz/FeX73MylLKQLs3DI0eijNn1rCImiREdCdCTRo0CBr0mKSDJoZggyiCHIaODAJxEqVIZGHQ7UFdqFtSmHLNt5+//z7//+d37v2OndAF//Nfe+219lp7n/34Op1ZUlVVVyZ4CzgEToAfwU5wh/tGZ4VdW5OBy4Dwi6BNJjHeeV2TM+CIB1yGftJZv4SfBtvAv7a9b7/5tMvqXNN0GWSRB3zOCWbg8QyKruSSLxq2edH/LzcDKwevMx/tdrs/kOgGt1eYF8kGFCteAMpquX8oaia+5IjbzMfMZ8xLzQ/DT1LUJTADzoGLLmDopW/uzhQx4wTLzVmJrbQfBXeDTSQ6Co+BP8ERFQHrNIyoEOlDCQEL5Qg/BSKP2zaB4Xsbz8On42D+HX4LlOLh4Zce5yR+Al2iXbzWifcXS1WdM4u0vNn9MX+GMt8xWUE150hb5yZ7TbJkWk7J4h51NOh58DrQJlRhG8EHQH/JZrANDCdU2QVZpk9d/m5Foy8BujgiE22j0rnDDlqFlY5tm9iVcBxzY+l46AhJXnXwavTpYqmqw7aN0F4MRsHNtq1E/wtItsRP3CapKHwPTjmv3zlAx+hG65+bR/kbToMLtE/Z9hv8tfXcBQOPVxLGQUclSaY8iGZUNh48bVuOmJudDkXoHsjZL/c57Tl+CZid+FZ3aBbHrWtjlZ0KN8+9u/soflqJq0oSxymXh2adm2oSPTPZEMcGlzH4X+X/oO0/mbOSDfeGSlCpFF4BjgHJ1rig6y2W6OJYIzucc5+N+YIckDPgAfvMnliG7DGObcdpT7zovw/kWdzXsKfgVfT/CiSHQF66/77BGs4vKRrRl8eqRpLXirX3s1121AXmPY0+qVPgWfddPTmOxQFeDpRU8oaDs6wf9czV27ZnmZ/Bvhd86/7Q8/YrBUpvFbyzdLscqcrvkjNcNgr8CEiR82LPgLQ3gK+A5BS43/GDk+OUAcfR8yC858C+JPTXOxZdN1j9KYSuW+xvIPmwET94s+GY5G+WsN7PYw7W4AtBnVT2CHYVlyv0FXSJrtEx+cBlRePfx3TmXN6EnsfhZQcOrBjfvmJo62j+AyTlaML1BdQ2ULnmuAJ1meRZvNfVaUZ6IMRN6O7GVKnYcvvRniZmv+PKU4vtguJka0tcbyT6f5ETMq4fBYKLQN9bNegqfw+sT6N3QOSAlfUkLH9BOloT0xn7z3YcI7BvKTOAmCLOuq0CJ/Bd5vZBs2671dYL1WseI4MQVyeZsl2v1ifYlSBFJUSsovQ1+pAayMf4/gHfDk6AJUDX6BEwcAL17iNYZ/J6yW6SauxS+JwZqxPR2yrRK/Mu0Lf2SZD/ErVV1C/ou0xjxP8W9G9A3u3OZQrCJLN+CTOBAAAAAElFTkSuQmCC',
    input: {
      action: 'Add',
      details: {
        event: 'WorkingOn',
      },
    },
    message: "I'm working on it",
  };
}

function iAmNotWorkingOnItOption(): AidRequestActionOption {
  return {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAA2klEQVR4Ae3aAQbDQBRF0YJsLmsNyOYC/GIKakDR93DuBvodUsnMf2mbJEmSJEnSzJwzc83MEZzh+MxwNuI8s7oXUgTnntWTR9rjTALpC2c6kDY4AaQNThHSet5XAaQNzrYrCLQGDCAFfjs7aD9OduB+nH6kPE4eqR8nj9SPk0fqx8kj9ePkkfpxgkj9OEGkfpw8Uj9OEul3HEh7HEh5nCwSHEAeMX/SeRxIXhR9avhYddzhwMyRa1MO7V37uDh09ZzP8oL1FwtUVvD+kiVOa8AWySVJkiRJkvQGSA1z0rXlRukAAAAASUVORK5CYII=',
    input: {
      action: 'Remove',
      details: {
        event: 'WorkingOn',
      },
    },
    message: "I'm not working on it",
  };
}

export default actionsAvailable;
