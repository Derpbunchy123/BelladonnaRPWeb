import { useState } from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const Rules = () => {
  const [openCategory, setOpenCategory] = useState<number | null>(0);

  const ruleCategories = [
    {
      title: "Community Rules",
      number: "01",
      rules: [
        "1.1 Respect and Conduct — Treat other members of the community with basic respect. Disagreements are inevitable, but harassment, targeted hostility, threats, and persistent attempts to make others uncomfortable are not acceptable. In-character conflict does not give you permission to harass someone out of character.",
        "1.2 Discrimination and Hate Speech — Hate speech, discriminatory harassment, and targeted abuse are prohibited. Roleplay is not a justification for attacking players over personal characteristics or identities.",
        "1.3 Out-of-Character Drama — Do not bring personal disputes into the city, use roleplay to continue an out-of-character argument, or attempt to rally other players against someone. If an issue cannot be resolved respectfully, use the appropriate staff ticket.",
        "1.4 Advertising — Do not advertise unrelated communities, servers, products, or services without permission from the appropriate staff.",
        "1.5 Staff Disputes — Do not derail an active scene or publicly disrupt the community to argue about a staff decision. If you disagree with a decision, follow the appeal process in Section 08.",
        "1.6 Community Integrity — Scamming, intimidation, manipulation, or deliberately exploiting another community member outside the intended roleplay experience may result in staff intervention.",
      ],
    },
    {
      title: "General City Rules",
      number: "02",
      rules: [
        "2.1 Serious Roleplay — BelladonnaRP is a serious roleplay city. Players are expected to make decisions that suit their characters and the circumstances of the scene. Unrealistic behavior, deliberately disruptive actions, or repeatedly disregarding the consequences of your character's choices may be treated as Fail RP. The city is beginner-friendly, so ask questions when you are unsure.",
        "2.2 Metagaming — Metagaming is using information your character has not obtained in character. Information from Discord, streams, private messages, another character, or an out-of-character conversation cannot be used to influence your character's decisions unless the information is legitimately obtained in roleplay.",
        "2.3 Powergaming — Powergaming includes forcing outcomes onto another character without giving the other player a reasonable opportunity to respond, or using unrealistic actions to gain an unfair advantage. Players must allow others to participate meaningfully in a scene.",
        "2.4 Fail RP — Fail RP is behavior that disregards realistic roleplay, established circumstances, or the consequences of an action. Players should make reasonable decisions based on what their characters know, experience, and are capable of doing.",
        "2.5 Random Deathmatch (RDM) — Attacking or killing another player without a valid roleplay basis is prohibited. Hostility and criminal intent must be established through appropriate roleplay. The five-minute lethal escalation requirement in Section 03 must also be followed.",
        "2.6 Vehicle Deathmatch (VDM) — Using a vehicle to intentionally run over or attack players without a valid roleplay basis is prohibited. Vehicles must not be used as an unrestricted weapon to avoid normal roleplay interactions.",
        "2.7 Combat Logging — Leaving the server to avoid the consequences of an active scene, arrest, injury, robbery, or other roleplay situation is prohibited. If a genuine technical issue prevents you from continuing, communicate with the other involved players or staff as soon as reasonably possible.",
        "2.8 Fear RP and Valuing Life — Your character should respond appropriately to credible threats. Do not disregard serious danger simply because you want to win a scene or avoid its consequences. Characters may be captured, injured, robbed, or placed in unfavorable situations. Players must allow these outcomes to matter.",
        "2.9 Scene Interference — Do not interfere with an active scene without a legitimate roleplay reason. Third parties should not insert themselves into an ongoing conflict simply to gain an advantage, collect information, or disrupt the participants.",
        "2.10 New Life Rule (NLR) — When a character becomes fully incapacitated, they forget the 15 minutes immediately preceding their incapacitation. They cannot use information from that period to identify those involved, return to the same conflict, seek revenge, or continue the incident as though they remember what happened. If a character is taken to Grandma's or the hospital before becoming fully incapacitated, their memories remain intact but fuzzy. A fully incapacitated character must not return to the same scene or conflict.",
        "2.11 Character Names and Realism — Character names and behavior must be appropriate for the city's roleplay environment. Names intended to troll, impersonate real individuals inappropriately, or undermine the setting may be rejected or require changes.",
        "2.12 Roleplay Commands — Players are strongly encouraged to use /me and /do throughout roleplay. These commands help communicate actions, physical details, observations, and information that cannot be clearly represented through the game's animations or mechanics. They should not be used to force outcomes onto another character.",
      ],
    },
    {
      title: "Roleplay, Combat and Criminal Activity",
      number: "03",
      rules: [
        "3.1 Character Development — Characters should have believable motivations and develop through their experiences. Players are encouraged to build relationships, create ongoing stories, and allow their characters to face consequences. Winning is not the purpose of every scene.",
        "3.2 Lethal Escalation — An active scene must have been underway for at least five minutes before a player may take lethal action against another character. The five-minute requirement does not automatically authorize a killing. There must still be a valid roleplay reason, appropriate escalation, and compliance with all other applicable rules. Players must not manufacture a scene solely to satisfy the time requirement before immediately resorting to lethal force.",
        "3.3 Hostages and Kidnapping — Kidnapping and hostage-taking are permitted throughout the city except in designated green zones. Hostage interactions must provide meaningful roleplay. Players should not treat hostages as disposable props or use them solely to force an outcome without allowing the scene to develop. There are currently no specific limits on hostage demands.",
        "3.4 Robberies and Heists — A maximum of six participants may take part on the criminal side of a robbery or heist. A 20-minute cooldown begins at the start of a robbery. Criminals may rob players of their belongings, with the exception of subscriber items. Subscriber items are not to be taken through robbery or other criminal inventory interactions.",
        "3.5 Green Zones — The hospital, barber shops, and clothing stores are designated green zones. Criminal activity, kidnapping, and hostage-taking cannot be initiated inside these areas. An existing, active scene may continue if it moves into a green zone, but that exception does not authorize new crimes or new hostage situations to begin inside the area. Players must not deliberately exploit green-zone boundaries to evade the consequences of an active scene.",
        "3.6 Revenge RP — Personal grudges and previous conflicts do not automatically justify attacking another character. Players must follow NLR, escalation requirements, and other applicable rules. A character who has forgotten an incident cannot act on information they no longer remember.",
        "3.7 Scene Priority — Players must respect the natural development of active scenes. Do not interrupt an ongoing interaction simply because you want to force a different outcome. Staff may pause, redirect, or end a scene when intervention is necessary to address a rule violation.",
        "3.8 Character Injuries and Medical Treatment — Players are expected to roleplay injuries and their consequences reasonably. Additional procedures may be established through EMS SOPs or other city guidelines.",
        "3.9 Permanent Character Death — Players who wish to permanently kill off their own character must open a staff ticket beforehand. No character may be permanently killed without the player's consent. This does not prevent a character from being captured, injured, robbed, threatened, or otherwise suffering serious consequences.",
      ],
    },
    {
      title: "Gang and Criminal Organization Rules",
      number: "04",
      rules: [
        "4.1 Gang Approval — Established gangs must submit an application and receive approval before operating as an official gang. BelladonnaRP recognizes approved gangs and whitelisted gangs. Small unofficial groups are also permitted under the restrictions in 4.2.",
        "4.2 Unofficial Groups — Players may form small groups without formal gang approval, provided they do not present themselves as an established gang. Unofficial groups may not exceed six members, may not carry a gang flag, and may not use identifying marks that establish the group as an official gang.",
        "4.3 Approved Gangs — Approved gangs may have up to 16 members. Approval does not exempt a gang or its members from the main city rules, gang violation procedures, or staff oversight.",
        "4.4 Whitelisted Gangs — Whitelisted gangs may have up to 24 members. Whitelisting is a staff-selected status. Staff will approach gangs when they are ready to offer whitelisting. Consistent activity, quality roleplay, and responsible conduct can improve a gang's chances of being selected.",
        "4.5 Gang Leadership — Gang leaders are responsible for running their organizations, managing their membership, and holding their members accountable. A member's conduct can affect the standing of the entire gang.",
        "4.6 Alliances — Gangs may form alliances with other gangs. Alliances do not exempt members from the rules governing criminal activity, escalation, robberies, or other roleplay.",
        "4.7 Gang Wars — Gang wars must be declared through the KP and formally ended through the KP. Gangs are expected to follow the established declaration and conclusion process. Staff may intervene when a conflict violates server rules.",
        "4.8 Territory and Rival Attacks — BelladonnaRP does not currently impose special territory restrictions or additional restrictions on attacking rival gang members. All attacks must still comply with the main city rules, including valid roleplay escalation and the five-minute lethal requirement.",
        "4.9 Gang Violations — Gang violations are tracked separately from ordinary individual staff actions. When a gang is brought into a staff ticket over a major rule violation, it may receive one or more violation points. Staff determine the number of points and appropriate response. There is no automatic warning ladder or fixed punishment sequence for gang violations.",
        "4.10 The Secret Code: When submitting your whitelist application you will need to know this word: BANANA.",
      ],
    },
    {
      title: "Emergency Services",
      number: "05",
      rules: [
        "5.1 Police Conduct — Police officers must follow the applicable department SOPs and the main city rules. Officers are expected to uphold their department's standards while participating in believable roleplay.",
        "5.2 Police Corruption — Police officers may choose to engage in corruption at their own discretion, subject to applicable server rules and department procedures. High Command members are prohibited from being corrupt. Corruption must not be used as an excuse for metagaming, exploiting department access, or deliberately undermining the city outside legitimate roleplay.",
        "5.3 Multiple Characters — Officers may maintain criminal characters on separate character slots. Players must not use information, resources, access, or influence obtained through one character to unfairly benefit another character.",
        "5.4 Off-Duty Equipment — Off-duty officers must return their department equipment to their assigned vehicle or locker for safekeeping. Failure to secure equipment will be handled through in-character consequences provided the incident does not also involve a separate rule violation.",
        "5.5 EMS Conduct — EMS personnel may refuse treatment. EMS members must follow their department SOPs and maintain appropriate roleplay standards when dealing with patients and other city personnel.",
        "5.6 Department SOPs — Department-specific SOPs are maintained separately from this main rulebook. Officers, EMS personnel, and other emergency services members are responsible for knowing and following the SOPs applicable to their department. Department SOPs do not override the main city rules unless staff explicitly intervene.",
      ],
    },
    {
      title: "Supernatural Rules",
      number: "06",
      rules: [
        "6.1 Supernatural Applications — All supernatural characters must have an application submitted and approved by staff before the player begins roleplaying as a supernatural character. Players must not assume that a character may use supernatural abilities simply because the species exists within the city's lore.",
        "6.2 Recognized Species — The main supernatural species include Vampires, Werewolves, Witches, and other species approved by staff. Each species may have its own lore, limitations, abilities, and additional requirements.",
        "6.3 Hunters — The Hunters are a secret organization. Their existence, membership, and activities are not public knowledge by default. Players may become involved through applying to join, being hand-selected by staff, or becoming involved through roleplay. Discovery of the organization must occur through roleplay.",
        "6.4 Supernatural Abilities — Mind control, memory alteration, and forced transformations are permitted only in accordance with the applicable faction guide and its D20 challenge procedure. Players may not bypass the challenge system or use supernatural abilities to force an outcome outside the permitted rules.",
        "6.5 Character Death and Consequences — No character may be permanently killed without the player's consent. Supernatural status does not make a character exempt from capture, injury, defeat, or other serious roleplay consequences.",
        "6.6 Faction Guides — Supernatural factions may have separate guides defining their lore, powers, limitations, ranks, and procedures. Players must follow the applicable faction guide in addition to this rulebook.",
      ],
    },
    {
      title: "Exploits, Cheating and Server Integrity",
      number: "07",
      rules: [
        "7.1 Cheating — Third-party cheats, hacks, or unauthorized tools used to gain an unfair advantage are prohibited.",
        "7.2 Exploiting Bugs — Players must not deliberately abuse bugs, glitches, or unintended mechanics to gain money, items, access, information, or other advantages. Report significant bugs to staff rather than using them for personal benefit.",
        "7.3 Duplication and Economy Abuse — Item duplication, deliberate economy exploits, and other methods of bypassing intended server mechanics are prohibited.",
        "7.4 Unfair External Advantages — Do not use external tools or unauthorized modifications to gain an unfair advantage over other players.",
        "7.5 Stream Sniping — Using a player's stream or other out-of-character live information to gain an in-character advantage is prohibited.",
        "7.6 Alternate Accounts — Alternate accounts must not be used to evade punishments, bypass restrictions, exploit systems, or transfer prohibited information between characters or accounts.",
        "7.7 Reporting Technical Issues — Players should report significant technical issues and suspected exploits through the appropriate staff channels. Staff will determine how the issue should be handled.",
      ],
    },
    {
      title: "Staff, Tickets and Enforcement",
      number: "08",
      rules: [
        "8.1 Staff Intervention — Staff may intervene in any roleplay scene, department decision, or faction decision when they determine that it is breaking server rules or requires intervention to protect the integrity of the city. Players are expected to cooperate with staff direction.",
        "8.2 Ticket-Based Enforcement — BelladonnaRP does not use a fixed automatic warning system. When staff need to address conduct, they may pull the involved players into a ticket to review the incident, discuss the circumstances, and determine an appropriate response.",
        "8.3 Staff Discretion — All violations and resulting actions are determined by staff. Staff may consider the seriousness of the incident, available evidence, surrounding circumstances, and the effect on the community. There is no requirement to follow a fixed progression of warnings or punishments.",
        "8.4 Staff Complaints — Only the Owner and Community Managers may access tickets opened specifically about staff members. This restriction is intended to keep staff complaints confidential and protect the integrity of the review process.",
        "8.5 Appeals — Players who disagree with a staff decision should submit a separate appeal ticket. Where possible, the appeal should be reviewed by staff who were not involved in the original decision.",
        "8.6 Evidence and Cooperation — Players should provide relevant evidence when reporting a rule violation or appealing a decision. Players are expected to cooperate with reasonable requests during an investigation.",
        "8.7 Staff Authority — Staff may override roleplay scenes, department decisions, and faction decisions when they determine that those decisions violate the rules or require intervention. This authority applies to all players and groups, regardless of rank or status.",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.5em] uppercase text-bella-rose mb-4">
            City Law
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mb-6">
            Server Rules
          </h1>
          <div className="ornament-line h-px w-48 mx-auto mb-6" />
          <p className="font-body text-base text-muted-foreground">
            Following these rules ensures a fair and immersive experience for everyone
          </p>
        </div>

        {/* Important notice */}
        <div
          className="rounded-sm p-6 mb-10 border"
          style={{
            background: "hsl(344 47% 18% / 0.2)",
            borderColor: "hsl(344 47% 30% / 0.4)",
          }}
        >
          <p className="font-body text-sm text-foreground leading-relaxed text-center">
            <span className="font-medium" style={{ color: "hsl(340 30% 60%)" }}>Important: </span>
            Ignorance of the rules is not an excuse. All players are expected to read and understand these rules before joining. Violations may result in warnings, temporary bans, or permanent removal. These rules apply to all players regardless of position, department, faction, or length of time in the community.
          </p>
        </div>

        {/* Accordion rules */}
        <div className="space-y-2">
          {ruleCategories.map((category, index) => {
            const isOpen = openCategory === index;
            return (
              <div key={index} className="stat-card-glow rounded-sm overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-white/[0.02]"
                  onClick={() => setOpenCategory(isOpen ? null : index)}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="font-body text-xs font-medium tabular-nums"
                      style={{ color: "hsl(344 47% 45%)" }}
                    >
                      {category.number}
                    </span>
                    <h2 className="font-display text-xl font-medium text-foreground">
                      {category.title}
                    </h2>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-[2000px]" : "max-h-0"
                  )}
                >
                  <div className="px-6 pb-6">
                    <div
                      className="h-px mb-5"
                      style={{ background: "hsl(312 18% 22%)" }}
                    />
                    <ul className="space-y-4">
                      {category.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start gap-4">
                          <span
                            className="font-body text-xs font-medium tabular-nums mt-0.5 flex-shrink-0"
                            style={{ color: "hsl(344 47% 40%)" }}
                          >
                            {ruleIndex + 1}.
                          </span>
                          <span className="font-body text-sm leading-relaxed text-muted-foreground">
                            {rule}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Supplemental documents note */}
        <div
          className="rounded-sm p-6 mt-6 border flex items-start gap-4"
          style={{
            background: "hsl(38 60% 18% / 0.18)",
            borderColor: "hsl(38 60% 35% / 0.4)",
          }}
        >
          <AlertTriangle
            className="h-4 w-4 flex-shrink-0 mt-0.5"
            style={{ color: "hsl(38 60% 60%)" }}
          />
          <p className="font-body text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium" style={{ color: "hsl(38 60% 65%)" }}>Additional Documents: </span>
            Department SOPs, supernatural faction guides, gang and KP procedures, and other city policies supplement this rulebook. Players are responsible for following all documents applicable to their characters and activities.
          </p>
        </div>

        {/* Footer card */}
        <div
          className="rounded-sm p-8 mt-6 text-center border"
          style={{
            background: "hsl(344 47% 14% / 0.15)",
            borderColor: "hsl(344 47% 30% / 0.35)",
          }}
        >
          <h2 className="font-display text-2xl font-medium text-foreground mb-3">
            Questions About the Rules?
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            If you are unsure how a rule applies, ask a staff member before proceeding with an action that may cause a significant dispute. We are here to help ensure everyone has a great experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rules;
