import 'package:epubx/epubx.dart';
import 'package:flutter/material.dart';

class Book extends StatelessWidget {
  final EpubBook book;

  const Book({super.key, required this.book});

  @override
  Widget build(BuildContext context) {
    return Card(color: Colors.red, child: Text(book.Title ?? ''));
  }
}
