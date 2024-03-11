import 'package:epubx/epubx.dart';
import 'package:flutter/material.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:google_fonts/google_fonts.dart';

class Reader extends StatefulWidget {
  final EpubBook book;

  const Reader({super.key, required this.book});

  @override
  State<StatefulWidget> createState() => _ReaderState();
}

class _ReaderState extends State<Reader> {
  int _page = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: GestureDetector(
            onHorizontalDragEnd: (details) => print("Drag ended"),
            child: const Center(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(100),
                  child: Text("Hello world"),
                ),
              ),
            )));
  }
}
