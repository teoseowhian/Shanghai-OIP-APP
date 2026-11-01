import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Train, Check, Shirt, User, Sparkles, Navigation, Luggage, Plane, Users, Info } from 'lucide-react';
import { ITINERARY, ItineraryDay } from '../data/tripData';

interface ItineraryViewProps {
  onCheckInEvent: (coins: number, eventTitle: string) => void;
  onOpenPackingList?: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ onCheckInEvent, onOpenPackingList }) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [checkedInEvents, setCheckedInEvents] = useState<Record<string, boolean>>({
    '1-Arrive Shanghai Pudong (PVG) Terminal 1 — arrival of NP staff and students': true,
  });

  const selectedDay = ITINERARY.find((d) => d.dayNumber === selectedDayNumber) || ITINERARY[0];

  const handleCheckIn = (dayNum: number, eventTitle: string, coins: number = 5) => {
    const key = `${dayNum}-${eventTitle}`;
    if (checkedInEvents[key]) return;

    setCheckedInEvents((prev) => ({ ...prev, [key]: true }));
    onCheckInEvent(coins, eventTitle);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            <Calendar className="w-3.5 h-3.5 text-amber-300" /> Shanghai Immersion Schedule • 8-14 Nov 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">7-Day Immersion Itinerary</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Staying at <strong>Homeinn Plus Hotel (Yanchang Middle Rd, Jing'An)</strong>. Check into itinerary checkpoints to earn attendance coins and track daily meeting times!
          </p>
        </div>

        {/* Quick Weather / Shanghai Info */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-4 text-indigo-200">
            <span>Shanghai Weather:</span>
            <span className="font-bold text-white">🍂 10°C - 18°C (Late Autumn)</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-indigo-200">
            <span>Base Line:</span>
            <span className="font-bold text-amber-300">Metro Line 1 (Yanchang Rd)</span>
          </div>
          {onOpenPackingList && (
            <button
              onClick={onOpenPackingList}
              className="w-full mt-1 py-1.5 px-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Luggage className="w-3.5 h-3.5 text-slate-950" />
              <span>7-Day Packing Checklist</span>
            </button>
          )}
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ITINERARY.map((day) => {
          const isSelected = day.dayNumber === selectedDayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl transition-all text-left border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-[10px] font-black uppercase tracking-wider opacity-80">
                Day {day.dayNumber}
              </div>
              <div className="text-xs font-black truncate max-w-[130px]">{day.date.split(',')[0]}</div>
              <div className="text-[11px] font-medium opacity-90 truncate max-w-[130px] mt-0.5">
                {day.theme.split('&')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
        
        {/* Day Header Banner */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                Day {selectedDay.dayNumber} • {selectedDay.date}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {selectedDay.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Theme: <span className="text-slate-800 font-semibold">{selectedDay.theme}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-1.5 text-slate-700">
                <Shirt className="w-3.5 h-3.5 text-indigo-500" />
                <span><strong>Dress Code:</strong> {selectedDay.dressCode}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-1.5 text-slate-700">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span><strong>Lead:</strong> {selectedDay.leadInCharge}</span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-500">Key Stops:</span>
            {selectedDay.highlights.map((h, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200"
              >
                📍 {h}
              </span>
            ))}
          </div>
        </div>

        {/* Confirmed Flight Card (Displayed at the top of Day 1 and Day 7) */}
        {selectedDay.flightInfo && (
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-sky-400/40 relative overflow-hidden animate-in fade-in duration-200">
            {/* Ambient background glow */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-sm shrink-0">
                  <Plane className="w-5 h-5 text-sky-300 transform -rotate-45" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-sky-500/30 text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-400/40">
                      ✈️ Confirmed Flight Card
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {selectedDay.dayNumber === 1 ? 'Outbound Journey (Day 1)' : 'Homeward Bound (Day 7)'}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black tracking-tight mt-1 text-white">
                    {selectedDay.flightInfo.airline} • <span className="text-amber-300 font-mono">{selectedDay.flightInfo.flightNumber}</span>
                  </h4>
                </div>
              </div>

              {/* Group Meeting Time & Dress Code Pills */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                <div className="bg-amber-400 text-slate-950 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-md font-bold text-xs">
                  <Users className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Meeting: <strong className="font-black text-slate-950">{selectedDay.flightInfo.groupMeetingTime}</strong></span>
                </div>
                {selectedDay.flightInfo.dressCode && (
                  <div className="bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-2xl flex items-center gap-1.5 shadow-md font-bold text-xs">
                    <Shirt className="w-4 h-4 text-slate-950 shrink-0" />
                    <span>Dress Code: <strong className="font-black text-slate-950">{selectedDay.flightInfo.dressCode}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Flight Route Visualizer */}
            <div className="py-5 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
              {/* Origin Airport */}
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-300">Departure</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-wide mt-0.5">
                  {selectedDay.flightInfo.departureTime}
                </div>
                <div className="text-sm font-extrabold text-sky-100 mt-0.5">
                  {selectedDay.flightInfo.departureAirport}
                </div>
                {selectedDay.flightInfo.departureTerminal && (
                  <div className="text-xs font-semibold text-slate-300">
                    {selectedDay.flightInfo.departureTerminal}
                  </div>
                )}
              </div>

              {/* Direct Flight Center Display */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-sky-300 font-mono tracking-widest uppercase bg-sky-900/60 px-2.5 py-0.5 rounded-md border border-sky-400/30">
                  {selectedDay.flightInfo.flightNumber}
                </span>
                <div className="w-full flex items-center justify-center gap-2 my-2">
                  <div className="h-0.5 w-10 sm:w-16 bg-gradient-to-r from-transparent to-sky-400/60" />
                  <Plane className="w-4 h-4 text-sky-300" />
                  <div className="h-0.5 w-10 sm:w-16 bg-gradient-to-r from-sky-400/60 to-transparent" />
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Direct Non-Stop</span>
              </div>

              {/* Destination Airport */}
              <div className="text-left sm:text-right">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">Arrival</div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-wide mt-0.5">
                  {selectedDay.flightInfo.arrivalTime}
                </div>
                <div className="text-sm font-extrabold text-sky-100 mt-0.5">
                  {selectedDay.flightInfo.arrivalAirport}
                </div>
                {selectedDay.flightInfo.arrivalTerminal && (
                  <div className="text-xs font-bold text-amber-200">
                    {selectedDay.flightInfo.arrivalTerminal}
                  </div>
                )}
              </div>
            </div>

            {/* Meeting Point & Important Notes */}
            <div className="pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong className="text-white">Assembly & Roll Call:</strong> {selectedDay.flightInfo.meetingLocation}
                </span>
              </div>
              {selectedDay.flightInfo.notes && (
                <div className="text-[11px] text-sky-200/90 font-medium">
                  ℹ️ {selectedDay.flightInfo.notes}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline Schedule */}
        <div className="space-y-4">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Schedule & Check-in Checkpoints
          </h4>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {selectedDay.schedule.map((item, idx) => {
              const checkKey = `${selectedDay.dayNumber}-${item.event}`;
              const isChecked = !!checkedInEvents[checkKey];

              return (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-xs ${
                    isChecked ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}></div>

                  <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-2xl p-4 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono font-bold text-xs">
                          {item.time}
                        </span>
                        <h5 className="font-bold text-sm text-slate-900">{item.event}</h5>
                      </div>

                      {/* Check-in / Coin reward */}
                      {item.coinsAvailable && (
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs">
                            {item.checkInType ? item.checkInType : `+${item.coinsAvailable} Coins`}
                          </span>
                          <button
                            onClick={() => handleCheckIn(selectedDay.dayNumber, item.event, item.coinsAvailable)}
                            disabled={isChecked}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                              isChecked
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default opacity-90'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isChecked ? 'Checked In' : 'Record Check-in'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-medium text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {item.location}
                      </span>
                      {item.metroTip && (
                        <span className="flex items-center gap-1 text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 font-medium">
                          <Train className="w-3 h-3" />
                          {item.metroTip}
                        </span>
                      )}
                    </div>

                    {item.note && (
                      <div className="mt-2 text-xs text-amber-950 bg-amber-50/90 border border-amber-200/80 px-3 py-1.5 rounded-xl font-medium flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{item.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
