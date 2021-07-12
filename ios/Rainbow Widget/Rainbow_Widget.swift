//
//  Rainbow_Widget.swift
//  Rainbow Widget
//
//  Created by Christian Baroni on 7/7/21.
//  Copyright © 2021 Facebook. All rights reserved.
//

import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate)
            entries.append(entry)
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
}

struct Rainbow_WidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
      GeometryReader { geometry in
        ZStack {
            Rectangle()
              .fill(Color(red:0.15, green:0.16, blue:0.18))
//              .fill(Color(red: 0.506, green: 0.314, blue: 0.902))
              .offset(x: 0, y: 0)
          
            Rectangle()
              .fill(
                RadialGradient(gradient: Gradient(colors: [.black.opacity(0), .black]), center: .topLeading, startRadius: 0, endRadius: geometry.size.width * sqrt(2))
              )
              .opacity(0.08)
              
            Rectangle()
              .fill(
                RadialGradient(gradient: Gradient(colors: [.white.opacity(0), .black]), center: .bottomLeading, startRadius: 0, endRadius: geometry.size.width * sqrt(2) * 0.8323)
              )
              .blendMode(.overlay)
              .opacity(0.12)

            VStack(alignment: .leading) {
              HStack {
                Text("ETH")
                  .font(.system(size: 18, design: .rounded))
                  .fontWeight(.heavy)
                  .foregroundColor(Color.white)
                  .mask(
                    LinearGradient(gradient: Gradient(colors: [Color.white.opacity(0.9), Color.white.opacity(0.8)]), startPoint: .leading, endPoint: .trailing)
                  )
                  .offset(y: -0.5)
                  
                
                Spacer()
                
                Circle()
                  .fill(Color(red:0.15, green:0.16, blue:0.18))
                  .frame(width: 20, height: 20)
                  .shadow(color: .black.opacity(0.04), radius: 3, y: 3)
              }
              
              Spacer()
              
              HStack {
                VStack(alignment: .leading, spacing: 7) {
                  HStack(spacing: 4) {
                    Image(systemName: "arrow.up")
                      .font(.system(size: 18, weight: .heavy, design: .rounded))
                      .foregroundColor(Color.white)
                    Text("4.82%")
                      .font(.system(size: 18, design: .rounded))
                      .fontWeight(.heavy)
                      .foregroundColor(Color.white)
                  }.mask(
                    LinearGradient(gradient: Gradient(colors: [Color.white.opacity(0.9), Color.white.opacity(0.7)]), startPoint: .leading, endPoint: .trailing)
                  )
                  
                  Text("$2,202.82")
                    .font(Font.custom("SFRounded-Heavy", size: 28))
                    .fontWeight(.heavy)
                    .foregroundColor(Color.white)
                    .minimumScaleFactor(0.01)
                    .lineLimit(1)
                    .frame(maxHeight: 20)
                }
              }.padding(.bottom, 8)
              
              Spacer()
              
              Text("Just now")
                .font(.system(size: 10, design: .rounded))
                .fontWeight(.bold)
                .foregroundColor(Color.white.opacity(0.4))
            }
              .padding(16)
        }
      }
    }
}

@main
struct Rainbow_Widget: Widget {
    let kind: String = "Rainbow_Widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            Rainbow_WidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Price Widget")
        .description("Keep an eye on the price of your favorite assets.")
    }
}

struct Rainbow_Widget_Previews: PreviewProvider {
    static var previews: some View {
        Rainbow_WidgetEntryView(entry: SimpleEntry(date: Date()))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
